# Assignment Portal

## Overview

Assignment Portal is a web application designed to manage assignments and users.
It provides a platform for users to submit assignments and for admins to review and manage them.

## Features

* User registration and login
* Assignment submission and review
* Admin dashboard for managing assignments and users
* Secure authentication and authorization using JSON Web Tokens (JWT)
* Support for multiple user roles (admin, user)

## Functionalities

### Users

* Register and login to the platform
* Submit assignments
* View their submitted assignments

### Admins

* View and manage all assignments
* Accept or reject assignments
* View user information and manage user roles

## How to Run

### Step 1: Clone the Repository

```
git clone https://github.com/Mehul2044/assignment_portal.git
```

### Step 2: Install Dependencies

```
cd assignment_portal
npm install
```

### Step 3: Run the Application
 - Create a `.env` file with the following variables:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: JWT secret key
   - `PORT`: Port to run the application on (default is 5000)
 - Run the application with `npm start`

### Step 4: Access the Application

- You can now access the application at [http://localhost:5000](http://localhost:5000). 
- You can view the API documentation at [http://localhost:5000/api-docs](http://localhost:5000/api-docs).
- To access the API, use the following URL: [http://localhost:5000/api](http://localhost:5000/api).


## Security

- The application uses JSON Web Tokens (JWT) for authentication and authorization.
- The JWT secret key is stored in the environment variable `JWT_SECRET`.
- Password hashing is used for secure password storage.
- The application uses bcrypt for password hashing.
- It also generates log files in the `logfile.log` file for error and access logs.