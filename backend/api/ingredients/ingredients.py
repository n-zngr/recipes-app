from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/households", tags=["Ingredients"])

class Ingredient(BaseModel):
    name: str

mock_storage = {
    "sl1cdzSAbdpV7eBVOoHv": []
}

@router.get("/{household_id}/ingredients")
async def get_ingredients(household_id: str):
    if household_id != "sl1cdzSAbdpV7eBVOoHv":
        raise HTTPException(status_code=404, detail="Only test household ID is supported")

    return {
        "household_id": household_id,
        "ingredients": mock_storage[household_id]
    }

@router.post("/{household_id}/ingredients")
async def add_ingredient(household_id: str, ingredient: Ingredient):
    if household_id != "sl1cdzSAbdpV7eBVOoHv":
        raise HTTPException(status_code=404, detail="Only test household ID is supported")

    mock_storage[household_id].append(ingredient.dict())
    return {
        "message": "Ingredient added successfully",
        "ingredient": ingredient
    }
