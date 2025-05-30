from fastapi import APIRouter, HTTPException, Depends, status, Response
from pydantic import BaseModel
from firebase import db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["users"])

USERS_COLLECTION = "users"
HOUSEHOLDS_COLLECTION = "households"

class User(BaseModel):
    email: str
    password: str

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
        
        return {"message": "User created successfully", "user_id": new_user_ref.id}
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Log exception for debugging
        print(f"Error creating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while creating the user."
        )

@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        users_ref = db.collection(USERS_COLLECTION)
        query = users_ref.where("email", "==", form_data.username).limit(1)
        user_docs = query.get()
        
        if not user_docs:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        user_doc = user_docs[0]
        user_data = user_doc.to_dict()

        if form_data.password != user_data["password"]:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        user_id = user_doc.id

        response.set_cookie(
            key="user_id",
            value=user_id,
            httponly=False,
            max_age=604800,
            secure=False,
            samesite="lax"
        )

        return {"message": "Login successful", "user_id": user_id }
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f'Error during login: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'An unexpected error occurred during login: {str(e)}'
        )