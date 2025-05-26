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


# API Routes
All api routes are located under the `/backend/api/` directory.
## Users
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

## Households
> [!NOTE] Information
> Directory: `[/backend/api/households/](/backend/api/households/)`
> File: `[/backend/api/households/households.py](/backend/api/households/households.py)`
> 
> Routes: `GET`, `POST`

### `GET /households/`

Returns a list of all households.

Mainly used for development and debugging purposes.

```json
[
  {
    "name": "someHousehold",
    "owner": "userId",
    "admins": [],
    "members": ["user1234"],
    "users": ["userId", "user1234"],
    "ingredients": []
  }
]
```

### `POST /households/create`

Creates a new household.

Requires user authentication via user_id cookie.

Accepts a list of member_emails to be added at creation.

If any email does not match a user, the request will fail.

```json
{
    "name": "New Household",
    "member_emails": ["user1@example.com", "user2@example.com"]
}

**Response:**

```json
{
  "message": "Household successfully created",
  "household_id": "household123"
}
```

Sets a household_id cookie for the session.

### `GET /households/joined`

Returns a list of all households the currently logged-in user has joined.

```json
[
  {
    "id": "abc123",
    "name": "Household A"
  },
  {
    "id": "def456",
    "name": "Household B"
  }
]
```

### `GET /households/admin`

Checks if the current user is an admin or the owner of the current household.

Uses user_id and household_id cookies.

```json
{
  "authorized": true
}
```

### GET /households/users

Returns all users in the current household, categorized by role.

Uses household_id cookie.

```json
{
  "owner": {
    "id": "user123",
    "email": "owner@example.com"
  },
  "admins": [
    {
      "id": "user124",
      "email": "admin@example.com"
    }
  ],
  "members": [
    {
      "id": "user125",
      "email": "member@example.com"
    }
  ]
}
```

### POST /households/add-member

Adds a user to the current household via email.

Requires household_id cookie.

```json
{
  "email": "newmember@example.com"
}
```

**Response**:

```json
{
  "message": "Member added successfully",
  "user_id": "user126"
}
```

### POST /households/promote

Promotes a member to an admin.

```json
{
  "user_id": "user125"
}
```

**Response**:
```json
{
  "message": "User promoted to admin"
}
```

### POST /households/demote

Demotes an admin to a member.

``````json
{
  "user_id": "user124"
}
```

**Response**:

``````json
{
  "message": "User demoted to member"
}
```

### `POST /households/remove`

Removes a user from the household.

The owner cannot be removed.

``````json
{
  "user_id": "user124"
}
```

**Response**:
``````json
{
  "message": "User removed"
}
```