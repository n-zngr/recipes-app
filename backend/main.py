from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import sys
import importlib.util

# Importiere deine API-Router
from api.users import users
from api.households import households
from api.ingredients import router as ingredients_router

# Pfad zu predict.py setzen
current_script_dir = os.path.dirname(os.path.abspath(__file__))
predict_module_path = os.path.join(current_script_dir, 'model', 'predict.py')

if not os.path.exists(predict_module_path):
    print(f"CRITICAL ERROR: predict.py not found at the expected path: {predict_module_path}")
    print("Please ensure the path 'backend/model/predict.py' is correct relative to your main.py.")
    sys.exit(1)

# predict.py dynamisch laden
try:
    spec = importlib.util.spec_from_file_location("predict_module_name", predict_module_path)
    if spec is None:
        raise ImportError(f"Could not create module specification for {predict_module_path}")

    predict = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = predict
    spec.loader.exec_module(predict)
    print(f"Successfully loaded predict.py from: {predict_module_path}")

except Exception as e:
    print(f"CRITICAL ERROR: Failed to load predict.py from path: {predict_module_path}. Error: {e}")
    predict = None
    sys.exit(1)

# FastAPI App initialisieren
app = FastAPI()

# CORS aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔁 API Router mit /api Prefix definieren
api_router = APIRouter(prefix="/api")
api_router.include_router(users.router)
api_router.include_router(households.router)
api_router.include_router(ingredients_router)

# 📌 API-Router in App einbinden
app.include_router(api_router)

# Root-Route
@app.get("/")
async def root():
    return {"message": "Recipes Backend running"}

# Modell für Recommendation-Request
class RecommendationRequest(BaseModel):
    ingredients: list[str]
    top_n: int = 5

# POST /recommend Endpoint (außerhalb von /api – das ist so gewollt)
@app.post("/recommend")
async def recommend_items(request: RecommendationRequest):
    if predict is None or \
       predict._vectorizer is None or \
       predict._recipe_matrix_X is None or \
       predict._recipes_df is None:
        raise HTTPException(status_code=503, detail="Recommendation model components not loaded. Check server logs for errors during predict.py initialization.")

    try:
        recommended_recipes = predict.recommend(request.ingredients, request.top_n)

        if not recommended_recipes:
            return {"message": "No recommendations found for the given ingredients.", "recommendations": []}

        return {"recommendations": recommended_recipes}
    except Exception as e:
        print(f"Error during recommendation in /recommend endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred during recommendation: {str(e)}")
