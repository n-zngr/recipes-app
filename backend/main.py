# main.py (Simplified)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import recipes # Your router module

app = FastAPI()

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(recipes.router) # Include the router from api/recipes.py

# --- Root Endpoint (Optional) ---
@app.get("/")
async def root():
    return {"message": "Recipe AI Backend is running!"}

# NO model loading logic needed here anymore