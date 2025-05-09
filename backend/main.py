from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import sys
import importlib.util

from api.users import users
from api.households import households

current_script_dir = os.path.dirname(os.path.abspath(__file__)) # Get current "backend" directory

# Construct the absolute path to predict.py
# IMPORTANT: Ensure 'backend' and 'model' reflect the correct directory names
# and structure relative to where your main.py resides.
predict_module_path = os.path.join(current_script_dir, 'model', 'predict.py')

if not os.path.exists(predict_module_path):
    print(f"CRITICAL ERROR: predict.py not found at the expected path: {predict_module_path}")
    print("Please ensure the path 'backend/model/predict.py' is correct relative to your main.py.")
    sys.exit(1)

# Load the module directly from its file path
try:
    # Create a module specification
    spec = importlib.util.spec_from_file_location("predict_module_name", predict_module_path)
    if spec is None:
        raise ImportError(f"Could not create module specification for {predict_module_path}")

    # Create a new module from the specification
    predict = importlib.util.module_from_spec(spec)

    # Add the module to sys.modules so it behaves like a regular import
    sys.modules[spec.name] = predict

    # Execute the module's code (this will run the model loading in predict.py)
    spec.loader.exec_module(predict)
    print(f"Successfully loaded predict.py from: {predict_module_path}")

except Exception as e:
    print(f"CRITICAL ERROR: Failed to load predict.py from path: {predict_module_path}. Error: {e}")
    # Set predict to None so subsequent code can check its existence and handle gracefully
    predict = None
    sys.exit(1) # Exit the application if loading fails

# --- END DIRECT MODULE LOADING ---


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing router inclusions
app.include_router(users.router)
app.include_router(households.router)

@app.get("/")
async def root():
    return {"message": "Recipes Backend running"}

# Define a Pydantic model for the request body of the /recommend endpoint
class RecommendationRequest(BaseModel):
    ingredients: list[str]
    top_n: int = 5

@app.post("/recommend")
async def recommend_items(request: RecommendationRequest):
    """
    Endpoint to get recipe recommendations based on a list of ingredients.
    This endpoint utilizes the recommendation logic defined in predict.py.
    """
    # Ensure 'predict' module was successfully loaded and its components are ready
    if predict is None or \
       predict._vectorizer is None or \
       predict._recipe_matrix_X is None or \
       predict._recipes_df is None:
        raise HTTPException(status_code=503, detail="Recommendation model components not loaded. Check server logs for errors during predict.py initialization.")

    try:
        # Call the recommend function from the loaded 'predict' module
        recommended_recipes = predict.recommend(request.ingredients, request.top_n)

        if not recommended_recipes:
            return {"message": "No recommendations found for the given ingredients.", "recommendations": []}

        return {"recommendations": recommended_recipes}
    except Exception as e:
        print(f"Error during recommendation in /recommend endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred during recommendation: {str(e)}")
