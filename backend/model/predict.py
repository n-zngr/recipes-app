import joblib
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

vectorizer, X, df = joblib.load("model.pkl")

def recommend(user_ingredients: list, top_n=5): 
    query = ', '.join(user_ingredients)
    query_vec = vectorizer.transform([query])
    scores = cosine_similarity(query_vec, X).flatten()
    top_indices = scores.argsort()[-top_n:][::-1]
    return df.iloc[top_indices][["name", "ingredients"]].to_dict(orient="records")