from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import recipes
from api import ingredients

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipes.router)
app.include_router(ingredients.router)