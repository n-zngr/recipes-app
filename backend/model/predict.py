import joblib
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer # Optional: for type hinting
from scipy.sparse._csr import csr_matrix # Optional: for type hinting

# --- Configuration ---
MODEL_PATH = "model\model.pkl"

# --- Load Objects ---
_vectorizer: CountVectorizer | None = None
_recipe_matrix_X: csr_matrix | None = None
_recipes_df: pd.DataFrame | None = None

try:
    print(f"Attempting to load data bundle from: {MODEL_PATH}")
    # Load the tuple saved by train.py
    loaded_data = joblib.load(MODEL_PATH)

    if isinstance(loaded_data, tuple) and len(loaded_data) == 3:
        # Unpack based on the known order from train.py
        _vectorizer, _recipe_matrix_X, _recipes_df = loaded_data
        print("Successfully unpacked vectorizer, recipe matrix (X), and recipes DataFrame.")

        # Basic validation of types
        if not isinstance(_vectorizer, CountVectorizer):
             print(f"Warning: Expected CountVectorizer at index 0, got {type(_vectorizer)}")
        if not isinstance(_recipe_matrix_X, csr_matrix):
             print(f"Warning: Expected csr_matrix at index 1, got {type(_recipe_matrix_X)}")
        if not isinstance(_recipes_df, pd.DataFrame):
             print(f"Warning: Expected DataFrame at index 2, got {type(_recipes_df)}")

    else:
        raise TypeError(f"Loaded data is not the expected tuple of 3 items. Type: {type(loaded_data)}")

except FileNotFoundError as e:
    print(f"CRITICAL ERROR loading file: {e}. Recommendation functionality will be disabled.")
except TypeError as e:
     print(f"CRITICAL ERROR during unpacking or type checking: {e}")
except Exception as e:
    print(f"CRITICAL ERROR during loading: {e}.")
    # Ensure variables are None if loading fails
    _vectorizer = _recipe_matrix_X = _recipes_df = None

# --- Recommendation Function ---
def recommend(ingredients: list[str], top_n: int = 5):
    """
    Recommends recipes based on cosine similarity between input ingredients
    and recipes in the database.
    """
    # Check if necessary components are loaded
    if _vectorizer is None or _recipe_matrix_X is None or _recipes_df is None:
        print("Error: Required components (vectorizer, recipe matrix, df) not loaded. Cannot recommend.")
        return [] # Return empty list or raise an error

    if not ingredients:
        print("Input ingredients list is empty.")
        return []

    try:
        # 1. Preprocess User Input Ingredients
        # Combine ingredients into a single string, like in training
        input_text = ", ".join(ingredients)
        print(f"Processing input: '{input_text}'")

        # Transform using the loaded vectorizer
        input_vector = _vectorizer.transform([input_text])
        print(f"Input vector shape: {input_vector.shape}") # Should be (1, num_features)

        # 2. Calculate Cosine Similarity
        # Compare input_vector (1 row) with all recipe vectors in _recipe_matrix_X (many rows)
        cosine_sim = cosine_similarity(input_vector, _recipe_matrix_X)
        # Result is typically [[sim1, sim2, ...]], so extract the first (only) row
        similarity_scores = cosine_sim[0]
        print(f"Calculated {len(similarity_scores)} similarity scores.")

        # 3. Get Top N Recommendations
        # Get indices of recipes sorted by similarity (highest first)
        # argsort gives indices from lowest to highest, so we reverse it with [::-1]
        top_indices = np.argsort(similarity_scores)[::-1]

        # Filter out recipes with 0 similarity? (Optional)
        # top_indices = [i for i in top_indices if similarity_scores[i] > 0]

        # Get the top N indices
        top_n_indices = top_indices[:top_n]
        print(f"Top {top_n} indices: {top_n_indices}")
        print(f"Top {top_n} scores: {similarity_scores[top_n_indices]}")


        # 4. Retrieve Recipe Details from DataFrame
        # Use the indices to get rows from the loaded DataFrame
        # .iloc is used for integer-location based indexing
        recommended_recipes_df = _recipes_df.iloc[top_n_indices]

        # Convert relevant columns to a list of dictionaries or desired format
        # Adjust columns based on your actual DataFrame structure
        results = recommended_recipes_df[['Name', 'Url', 'Ingredients']].to_dict(orient='records') # Example columns

        return results

    except Exception as e:
        print(f"Error during recommendation for ingredients {ingredients}: {e}")
        # import traceback # Uncomment for detailed error stack
        # print(traceback.format_exc()) # Uncomment for detailed error stack
        return [] # Return empty list on error
