from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from firebase import db

router = APIRouter(prefix="/users", tags=["users"])

USERS_COLLECTION = "users"

class User(BaseModel):
    email: str
    password: str

@router.post("/")
def create_user(user: User):
    users_ref = db.collection(USERS_COLLECTION)
    existing = users_ref.where("email", "==", user.email).get()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    users_ref.add(user.dict())
    return {"message": "User created successfully"}

@router.get("/")
def get_users(): 
    users_ref = db.collection(USERS_COLLECTION).stream()
    return [doc.to_dict() for doc in users_ref]

@router.delete("/{email}")
def delete_user(email: str):
    users_ref = db.collection(USERS_COLLECTION)
    matches = users_ref.where("email", "==", email).get()
    if not matches:
        raise HTTPException(status_code=404, detail="User not found")
    for doc in matches:
        doc.reference.delete()
    return {"message": "User deleted successfully"}
