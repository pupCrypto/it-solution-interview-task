# IT Solutions

## Introduction

This is a test task for the [IT-Solutions](https://itsolut.org/) vacancy.
This task has two parts:
- Part 1: The backend part of the task that is built using Django and the Django REST framework.
- Part 2: The frontend part of the task that is built using React with using antd library.

## Getting Started
### Prerequisites
- Python (used version: 3.11.0)
- [Node.js](https://nodejs.org/en/download/) (used version: v20.15.0)
- [npm](https://www.npmjs.com/get-npm) (used version: 10.7.0)
- [React](https://reactjs.org/docs/getting-started.html) (used version: 19.0.0)
- Django (used version: 5.1.5)

### Setup and installation
First of all you need to install all dependencies for backend
```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
After dependencies installation you sholud setup backend
```
cd cash_flow
python manage.py migrate
python manage.py filldefault  # This command is used for populating default values
python manage.py runserver
```
By default server can be accessed by http://localhost:8000.
After starting the server you should install and setup frontend:
```
cd frontend
npm ci
npm start
```
After all you will have two running apps:
- Django server on http://localhost:8000
- React frontend dev server on http://localhost:3000
Attention! For proper work of frontend out of the box Django server must be accessed by http://localhost:8000. If you want to change it you can find config file along the path:
```
frontend/src/config.js
```
and change default values for corresponding fields or provide env vars.

After all manipulations you can open a browser and visit http://localhost:3000 to checkout the whole project.