from fastapi import APIRouter, HTTPException, Depends, status, Response, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from firebase import db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["users"])

USERS_COLLECTION = "users"

class User(BaseModel):
    email: str
    password: str

def get_current_user(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user_id

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: User, response: Response):
    try:
        users_ref = db.collection(USERS_COLLECTION)
        existing = users_ref.where("email", "==", user.email).get()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        
        new_user_ref = users_ref.document()
        new_user_ref.set(user.dict())
        
        response.set_cookie(
            key="user_id",
            value=new_user_ref.id,
            httponly=True,
            max_age=604800,
            secure=False,
            samesite="lax"
        )
        
        return {"message": "User created successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        users_ref = db.collection(USERS_COLLECTION)
        query = users_ref.where("email", "==", form_data.username).limit(1)
        docs = query.get()
        
        if not docs:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        user_data = docs[0].to_dict()
        if form_data.password != user_data["password"]:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        response.set_cookie(
            key="user_id",
            value=docs[0].id,
            httponly=True,
            max_age=604800,
            secure=False,
            samesite="lax"
        )
        
        return {"message": "Login successful"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/me")
def check_auth(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )
    
    return JSONResponse(content={"user_id": user_id})