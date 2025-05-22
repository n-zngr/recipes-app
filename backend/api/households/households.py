from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from firebase import db

router = APIRouter(prefix="/households", tags=["households"])

HOUSEHOLDS_COLLECTION = "households"
USERS_COLLECTION = "users"

class Household(BaseModel):
    name: str
    member_emails: Optional[List[str]] = []

@router.get("/")
def get_households():
    households_ref = db.collection(HOUSEHOLDS_COLLECTION).stream()
    return [doc.to_dict() for doc in households_ref]

@router.post("/create")
def create_household(request: Request, household: Household):
    user_id = request.cookies.get('user_id')
    if not user_id: 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not authenticated')
    
    user_ref = db.collection(USERS_COLLECTION).document(user_id)
    user_doc = user_ref.get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="Requesting userId not found")

    member_ids = []
    if household.member_emails: 
        for email in household.member_emails:
            user_query = db.collection(USERS_COLLECTION).where('email', '==', email).limit(1).get()
            if user_query:
                member_ids.append(user_query[0].id)
            else: 
                raise HTTPException(status_code=404, detail=f'No user found for email: {email}')

    household_data = {
        'name': household.name,
        'owner': user_id,
        'admins': [],
        'members': member_ids,
        'users': [user_id] + member_ids,
        'ingredients': []
    }

    household_ref = db.collection(HOUSEHOLDS_COLLECTION).document()
    household_ref.set(household_data)

    response = JSONResponse(content={
        'message': 'Household successfully created',
        'household_id': household_ref.id
    })

    response.set_cookie(
        key='household_id',
        value=household_ref.id,
        httponly=False,
        max_age=604800,
        secure=False,
        samesite="lax"
    )
    return response
'''
@router.delete("/{name}")
def delete_household(name: str): 
    households_ref = db.collection(HOUSEHOLDS_COLLECTION)
    matches = households_ref.where("name", "==", name).get()
    if not matches:
        raise HTTPException(status_code=404, detail="Household not found")
    for doc in matches:
        doc.reference.delete()
    return {"message": "Household deleted successfully"}'''