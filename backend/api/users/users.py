from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from firebase import db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["users"])

USERS_COLLECTION = "users"

class User(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    message: str

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: User):
    users_ref = db.collection(USERS_COLLECTION)
    existing = users_ref.where("email", "==", user.email).get()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    users_ref.add(user.dict())
    return {"message": "User created successfully"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    users_ref = db.collection(USERS_COLLECTION)
    query = users_ref.where("email", "==", form_data.username).limit(1)
    docs = query.get()
    
    if not docs:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user_data = docs[0].to_dict()
    
    if form_data.password != user_data["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": "simulated-token",  # Placeholder token, will contain userId in future
        "token_type": "bearer",
        "message": "Login successful!"
    }

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
