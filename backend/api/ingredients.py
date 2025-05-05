from fastapi import APIRouter
from pydantic import BaseModel
from firebase import db

router = APIRouter()

class Ingredient(BaseModel):
    name: str
    quantity: str

@router.post('/households/{household_id}/ingredients')
def add_ingredient(household_id: str, ingredient: Ingredient):
    ref = db.collection("households").document(household_id).collection("ingredients")
    ref.add(ingredient.dict())
    return {"message": "Ingredient added successfully"}

@router.get('/households/{household_id}/ingredients')
def get_ingredients(household_id: str):
    ref = db.collection("households").document(household_id).collection("ingredients")
    docs = ref.stream()
    return [doc.to_dict() for doc in docs]