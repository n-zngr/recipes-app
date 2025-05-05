# api/recipes.py (Should be mostly correct already)

from fastapi import APIRouter
from pydantic import BaseModel
from model.predict import recommend # Make sure this path is correct

router = APIRouter()

class IngredientRequest(BaseModel):
    ingredients: list[str]

# Consider adding a prefix and tags for better organization/docs
# router = APIRouter(prefix="/recipes", tags=["Recommendations"])

@router.post('/recommend') # Will become /recipes/recommend if prefix is used
def recommend_recipes(req: IngredientRequest):
    # Calls the recommend function from model/predict.py
    results = recommend(req.ingredients)
    # Returns the results from the recommend function
    return {"recipes": results}