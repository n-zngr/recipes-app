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

@router.get('/admin')
def check_admin(request: Request): 
    household_id = request.cookies.get('household_id')
    user_id = request.cookies.get('user_id')

    if not household_id or not user_id:
        raise HTTPException(status_code=401, detail='Missing cookies')
    
    household_ref = db.collection(HOUSEHOLDS_COLLECTION).document(household_id)
    household_doc = household_ref.get()

    if not household_doc.exists:
        raise HTTPException(status_code=404, detail='Household not found')
    
    data = household_doc.to_dict()

    if user_id == data.get('owner') or user_id in data.get('admins', []):
        return { 'authorized': True }

    return { 'authorized': False }

@router.get('/users')
def get_household_users(request: Request): 
    household_id = request.cookies.get('household_id')

    if not household_id:
        raise HTTPException(status_code=401, detail='Missing household_id cookie')

    household_ref = db.collection(HOUSEHOLDS_COLLECTION).document(household_id)
    household_doc = household_ref.get()

    if not household_doc.exists:
        raise HTTPException(status_code=404, detail='Household not found')

    data = household_doc.to_dict()
    user_ids = data.get('users', [])

    users_data = []
    for user_id in user_ids:
        user_ref = db.collection(USERS_COLLECTION).document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            user = user_doc.to_dict()
            users_data.append({ "id": user_id, "email": user.get("email", "unknown") })

    return { "users": users_data }


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