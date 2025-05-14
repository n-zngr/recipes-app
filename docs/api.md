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
- API calls of `GET`, `POST`, `DELETE`, etc. should all be created inside the same file, which they utilized for. 
    - For example, all basic level user functions, like getting users `GET`, creating new users `POST`, deleting users `DELETE` should be inside the same `users.py` file. There should not be individual files for `create_user.py`, `get_users.py`, etc.  


## API Routes
All api routes are located under the `/backend/api/` directory.
### Users
> [!NOTE] Information
> Directory: `/users`
> File: `users.py`
> 
> Routes: `GET`, `POST`, `DELETE`

**GET**
- Returns a response of all households, used for development.

```json
[
    {
        "Users": [
            "userId"
        ],
        "name": "someHousehold"
    },
    {
        "users": [
            "user1234"
        ],
        "name": "someHousehold2"
    }
]
```

**POST**
- Creates a new user with `email` and `password`.

### Households
> [!NOTE] Information
> Directory: `[/backend/api/households/](/backend/api/households/)`
> File: `[/backend/api/households/households.py](/backend/api/households/households.py)`
> 
> Routes: `GET`, `POST`, `DELETE`

**GET**
- Returns a list of households, used for development.

**POST**
- Creates a new household with a `name` and an entry in the `users[]`
- Checks if the userId passed exists in the database
  - If not, it throws a 404 error
  - If the userId exists in the database, it creates the household

**DELETE**
- Deletes a household with the temporary `name` of the household, will need to be updated in the future.