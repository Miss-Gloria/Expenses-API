 EXPENSES API

The Expenses API is a RESTful API built with Node.js, Express.js, and MongoDB to help users track their personal expenses. It provides user authentication (JWT) and supports CRUD operations for expenses. The API is deployed on Render and documented on Postman.  

Postman Documentation: [View API Docs](https://documenter.getpostman.com/view/43019439/2sAYkDLKfw)  


##  Technologies & Packages Used  

| Package            | Description |
|--------------------|-------------|
| express       | Web framework for building APIs |
| mongoose      | ODM for MongoDB integration |
| jsonwebtoken  | JWT authentication for secure API access |
| bcrypt        | Password hashing for security |
| joi           | Input validation for request data |
| dotenv        | Manages environment variables |
| cors          | Enables Cross-Origin Resource Sharing |


## 🔗 Live API  
Base URL: [`https://expenses-api-0e6d.onrender.com`](https://expenses-api-0e6d.onrender.com)  


### 1️⃣ Register a New User  
Endpoint: `POST /auth/register`  
Request Body:                    |   Response:                
{                                |   {
  "username": "Gloria",          |   "message": "User registered successfully"
  "email": "gloria@example.com", |   }
  "password": "Gloria123!"       |   
}


### 2️⃣ User Login 
Endpoint: `POST /auth/register`  
Request Body:                    |   Response:                
{                                |   {         
  "email": "gloria@example.com", |   "token": "<JWT_TOKEN>"
  "password": "Gloria123!"       |   }
}

> Note: Use this token in Authorization headers for protected routes:
> Authorization: Bearer <JWT_TOKEN>


### 3️⃣ Get All Expenses  // 4️⃣ Get Expense by ID
Endpoint: `GET /expenses`   // `GET /expenses/{id}` {GET /expenses/67d6f8cad99b07e4860486d6}
Response (Example):                          
[
  {
    "user": "64d1f8c3e87f2b6e4d47a8b1",
    "item": "Laptop",
    "amount": 1200,
    "category": "Electronics",
    "payment": "Credit Card",
    "status": "Completed",
    "id": "67d6f8cad99b07e4860486d6"
  }
]



### 5️⃣ Add an Expense (Requires Authentication)  
Endpoint: `POST /expenses`  
Request Body:
{
  "item": "Book",
  "amount": 1200,
  "category": "Stationary",
  "payment": "Credit Card",
  "status": "Completed"
}
Response:
{
  "message": "Expense added successfully"
}


### 6️⃣ Delete an Expense (Requires Authentication)  
Endpoint: `DELETE /expenses/{id}` ||  /expenses/67d7401b25ea66d86a09645f
Response:
{
  "message": "Expense deleted successfully"
}


##  Future Updates  
- Get an architechural diagram
- Improve input validation with Joi
-  Enhance security with role-based access


