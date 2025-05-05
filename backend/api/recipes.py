from fastapi import APIRouter
from pydantic import BaseModel
from model.predict import recommend

router = APIRouter()

class IngredientRequest(BaseModel): 
    ingredients: list[str]

@router.post('/recommend')
def recommend_recipes(req: IngredientRequest): 
    results = recommend(req.ingredients)
    return {"recipes": results}