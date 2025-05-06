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
pip install fastapi uvicorn pandas numpy scikit-learn joblib firebase-admin
```