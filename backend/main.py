from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#from backend.api.recipes import recipes
#from backend.api.ingredients import ingredients
from api.users import users
from api.households import households

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try: 
    import joblib
    vectorizer, X, df = joblib.load("/model/model.pkl")
    print("Model loaded successfully")
except Exception as error:
    print(f"Warning: Model not loaded: {error}")
    vectorizer = x = df = None


#app.include_router(ingredients.router)
#app.include_router(recipes.router)
app.include_router(users.router)
app.include_router(households.router)

@app.get("/")
async def root():
    return {"message": "Recipes Backend running"}

