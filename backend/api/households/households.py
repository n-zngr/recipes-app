from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from firebase import db

router = APIRouter(prefix="/households", tags=["households"])

HOUSEHOLDS_COLLECTION = "households"
USERS_COLLECTION = "users"

class Household(BaseModel):
    name: str
    users: List[str]

@router.get("/")
def get_households():
    households_ref = db.collection(HOUSEHOLDS_COLLECTION).stream()
    return [doc.to_dict() for doc in households_ref]

@router.post("/")
def create_household(household: Household):
    user_id = household.users[0]
    user_doc = db.collection(USERS_COLLECTION).document(user_id).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail=f"User id {user_id} does not exist")

    db.collection(HOUSEHOLDS_COLLECTION).add(household.dict())
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