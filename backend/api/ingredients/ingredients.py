from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from firebase import db

router = APIRouter(prefix="/households", tags=["Ingredients"])

HOUSEHOLDS_COLLECTION = 'households'

class Ingredient(BaseModel):
    name: str

@router.get("/ingredients")
async def get_ingredients(request: Request):
    household_id = request.cookies.get('household_id')
    if not household_id: 
        raise HTTPException(status_code=401, detail='Missing household_id cookie')
    
    household_ref = db.collection(HOUSEHOLDS_COLLECTION).document(household_id)
    household_doc = household_ref.get()

    if not household_doc.exists:
        raise HTTPException(status_code=404, detail='Household not found')

    household_data = household_doc.to_dict()
    ingredients = household_data.get('ingredients', [])

    return { 'household_id': household_id, 'ingredients': ingredients }


@router.post("/ingredients")
def add_ingredient(request: Request, ingredient: Ingredient):
    household_id = request.cookies.get('household_id')
    if not household_id:
        raise HTTPException(status_code=401, detail='Missing household_id cookie')
    
    household_ref = db.collection(HOUSEHOLDS_COLLECTION).document(household_id)
    household_doc = household_ref.get()

    if not household_doc.exists:
        raise HTTPException(status_code=404, detail='Household not found')
    
    household_data = household_doc.to_dict()
    ingredients = household_data.get('ingredients', [])

    if any(item.get('name') == ingredient.name for item in ingredients):
        raise HTTPException(status_code=400, detail='Ingredient already exists')
    
    ingredients.append({'name': ingredient.name})
    household_ref.update({'ingredients': ingredients})

    return { 'message': 'Ingredient added successfully', 'ingredient': ingredient }