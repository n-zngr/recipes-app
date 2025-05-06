# API Documentation

## Getting Started
- To run the backend api use locate to `/backend` of the project.
    - Ensure the virtual environment is started, [learn more](/docs/getting-started.md)
- Run `uvicorn main:app --reload` to run the API respectively. 
    - You should now see the API running, by the following message: `INFO:     Uvicorn running on http://127.0.0.1:8000`

## Conventions
This section should improve consistency of the API across the project. Released code should not fail to abide by these conventions. 
- At the top of the API route file, the database collection should be defined as a variable, example:
    - ```py
        USERS_COLLECTION = "users"
- Route files should always be named in the plural ~~`ingredient.py`~~ `=>` `ingredients.py`. 