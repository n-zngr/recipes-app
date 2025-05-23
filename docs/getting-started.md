# Getting Started
To get started on this project, follow the steps below to get started. 

- VSC or similar IDE
- Local version of git installed
- Set up a folder in which you will clone the project from. Recommended: "Recipes-App"
- After opening VSC in the set up folder, use `git clone <REPO_URL>` to clone the repository in the created directory.
- After cloning successfully, use the terminal to navigate to `/frontend` and use `npm i`, installing the respective dependencies for the frontend directory, to allow for bundling the frontend.


## Running Backend
- Ensure you have the latest version of Python installed
- Head over to the `backend` directory, through `cd backend` in your terminal
- Create a virtual environment, by using `py -m venv venv`
- use `venv/Scripts/activate` to enter the virtual environment of the project
  - You can ensure whether this worked, through the `(venv)` prefix in your terminal

> [!CAUTION]
> To ensure you are in the virtual environment after startup, you must use the command again. `venv/Scripts/activate` 

- Install the respective pip dependencies inside the `backend` directory.

```bs
pip install python-multipart fastapi uvicorn pandas numpy scikit-learn joblib firebase-admin
```

## Understanding the `/recommend` Route

The backend provides an HTTP API endpoint at `http://127.0.0.1:8000/recommend` that allows you to get recipe recommendations based on a list of ingredients you provide. This functionality is implemented in the `backend/api/recipes.py` file, which utilizes the recipe recommendation model defined in `backend/model/predict.py`.

### How it Works

1.  **HTTP POST Request**: To get recommendations, you need to send an HTTP POST request to the `/recommend` endpoint.

2.  **Request Body**: The request should include a JSON body with a list of ingredients. The structure of the JSON payload should be:

    ```json
    {
      "ingredients": ["ingredient1", "ingredient2", ...]
    }
    ```

    For example, to get recommendations based on "tomato", "onion", and "garlic", the request body would be:

    ```json
    {
      "ingredients": ["tomato", "onion", "garlic"]
    }
    ```

3.  **Backend Processing (`backend/api/recipes.py`)**:
    -   When the backend receives a POST request at `/recommend`, the `recommend_recipes` function in `backend/api/recipes.py` is called.
    -   This function expects a JSON payload that conforms to the `IngredientRequest` Pydantic model, which simply contains a list of strings under the key `"ingredients"`.
    -   It then calls the `recommend` function from `backend/model/predict.py`, passing the list of ingredients received in the request.

4.  **Recommendation Logic (`backend/model/predict.py`)**:
    -   The `recommend` function takes the list of input ingredients and uses a pre-trained machine learning model to find similar recipes.
    -   **Loading the Model**: When the `predict.py` module is loaded, it attempts to load a pre-trained model and related data (`vectorizer`, `recipe_matrix_X`, `recipes_df`) from the `model/model.pkl` file. This file is created by the `train.py` script.
    -   **Preprocessing Input**: The input list of ingredients is joined into a single string, mimicking the format used during the model training.
    -   **Vectorization**: This combined string of ingredients is then transformed into a numerical vector using the `CountVectorizer` that was trained on the recipe data. This converts the text data into a format that the model can understand.
    -   **Similarity Calculation**: The cosine similarity is calculated between the vector of the input ingredients and the vectorized representations of all the recipes in the dataset (`_recipe_matrix_X`). Cosine similarity measures the similarity between two non-zero vectors of an inner product space.
    -   **Ranking and Filtering**: The recipes are then ranked based on their cosine similarity scores. The function selects the top `top_n` (default is 5) most similar recipes.
    -   **Returning Results**: Finally, the function retrieves the details (Name, Url, Ingredients, and Instructions) of these top recipes from the `_recipes_df` DataFrame and returns them as a list of dictionaries.

5.  **HTTP Response**: The backend then sends an HTTP response back to the client. The response will be a JSON object containing a list of recommended recipes:

    ```json
    {
      "recipes": [
        {
          "Name": "Recipe Title 1",
          "Url": "[http://example.com/recipe1](http://example.com/recipe1)",
          "Ingredients": "ingredient a, ingredient b, ingredient c",
          "Instructions": "Step 1: do this. Step 2: do that."
        },
        {
          "Name": "Recipe Title 2",
          "Url": "[http://example.com/recipe2](http://example.com/recipe2)",
          "Ingredients": "ingredient x, ingredient y",
          "Instructions": "First, ... Then, ..."
        },
        // ... more recommended recipes
      ]
    }
    ```
