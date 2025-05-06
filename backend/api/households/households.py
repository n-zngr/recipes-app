from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from firebase import db

router = APIRouter(prefix="/households", tags=["households"])

HOUSEHOLDS_COLLECTION = "households"

class Household(BaseModel):
    name: str
    users: List[str]

@router.get("/")
def get_households():
    households_ref = db.collection(HOUSEHOLDS_COLLECTION).stream()
    return [doc.to_dict() for doc in households_ref]

@router.post("/")
def create_household(household: Household):
    households_ref = db.collection(HOUSEHOLDS_COLLECTION)
    households_ref.add(household.dict())
    return {"message": "Household created successfully"}

@router.delete("/{name}")
def delete_household(name: str): 
    households_ref = db.collection(HOUSEHOLDS_COLLECTION)
    matches = households_ref.where("name", "==", name).get()
    if not matches:
        raise HTTPException(status_code=404, detail="Household not found")
    for doc in matches:
        doc.reference.delete()
    return {"message": "Household deleted successfully"}