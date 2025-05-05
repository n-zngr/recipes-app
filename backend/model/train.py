import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

df = pd.read_json("recipes.json")

vectorizer = CountVectorizer(tokenizer=lambda x: x.split(', '))
X = vectorizer.fit_transform(df["Ingredients"])

joblib.dump((vectorizer, X, df), "model.pkl")
print("Model trained and saved.")