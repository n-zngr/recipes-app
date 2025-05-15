from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
import importlib.util

# Router imports
from api.users.users import router as users_router
from api.households.households import router as households_router

# --- Load predict.py dynamically ---
current_script_dir = os.path.dirname(os.path.abspath(__file__))
predict_module_path = os.path.join(current_script_dir, 'model', 'predict.py')

if not os.path.exists(predict_module_path):
    print(f"CRITICAL ERROR: predict.py not found at the expected path: {predict_module_path}")
    sys.exit(1)

try:
    spec = importlib.util.spec_from_file_location("predict", predict_module_path)
    if spec is None:
        raise ImportError(f"Could not create module spec for {predict_module_path}")

    predict = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = predict
    spec.loader.exec_module(predict)
    print(f"Successfully loaded predict.py from: {predict_module_path}")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to load predict.py. Error: {e}")
    predict = None
    sys.exit(1)
# --- End predict.py loading ---

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router)
app.include_router(households_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Recipes Backend running"}

# Request model for recommendations
class RecommendationRequest(BaseModel):
    ingredients: list[str]
    top_n: int = 5

# Recommendation endpoint
@app.post("/recommend")
async def recommend_items(request: RecommendationRequest):
    if predict is None or \
       predict._vectorizer is None or \
       predict._recipe_matrix_X is None or \
       predict._recipes_df is None:
        raise HTTPException(
            status_code=503,
            detail="Recommendation model not loaded. See server logs for details."
        )

    try:
        recommended_recipes = predict.recommend(request.ingredients, request.top_n)

        if not recommended_recipes:
            return {
                "message": "No recommendations found for the given ingredients.",
                "recommendations": []
            }

        return {"recommendations": recommended_recipes}
    except Exception as e:
        print(f"Error during recommendation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal error during recommendation: {str(e)}"
        )
