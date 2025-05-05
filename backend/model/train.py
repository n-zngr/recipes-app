import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import json

with open("recipes.json", "r", encoding="utf-8") as f:
    data = json.load(f)

df = pd.DataFrame(data)

df["Ingredients"] = df["Ingredients"].apply(lambda lst: ", ".join(lst))

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df["Ingredients"])

joblib.dump((vectorizer, X, df), "model.pkl")
print("Model trained and saved successfully.")