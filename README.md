# Task Management REST API with Authentication and Role-Based Access

Full-stack assignment project with a Node.js, Express.js, MongoDB, and Mongoose backend plus a React.js Vite frontend.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT, bcryptjs
- Validation: express-validator
- API docs: Swagger UI
- Frontend: React.js, Vite, Axios, React Router

## Project Structure

```text
.
├── backend
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config
│       │   ├── db.js
│       │   └── swagger.js
│       ├── controllers
│       │   ├── authController.js
│       │   └── taskController.js
│       ├── middleware
│       │   ├── auth.js
│       │   ├── authorize.js
│       │   ├── errorHandler.js
│       │   ├── notFound.js
│       │   └── validate.js
│       ├── models
│       │   ├── Task.js
│       │   └── User.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   └── taskRoutes.js
│       ├── utils
│       │   ├── ApiError.js
│       │   ├── asyncHandler.js
│       │   └── generateToken.js
│       └── validations
│           ├── authValidation.js
│           └── taskValidation.js
├── frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── api
│       │   └── axios.js
│       ├── components
│       │   ├── Message.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── TaskForm.jsx
│       ├── context
│       │   └── AuthContext.jsx
│       ├── pages
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── styles.css
│       └── utils
│           └── getErrorMessage.js
└── README.md
```
## Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- CRUD Task Management - get,post,delete,patch
- Protected Routes
- Input Validation & Sanitization
- Swagger API Documentation
- React Frontend Integration
- Error Handling Middleware
- RESTful API Design
- Scalable Modular Architecture

## Prerequisites

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `backend/.env` if needed:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/task_management_api
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Backend runs at:

```text
http://localhost:5000
```

Swagger docs:

```text
http://localhost:5000/api-docs
```

Health check:

```text
GET http://localhost:5000/health
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Endpoint Table

Base URL:

```text
http://localhost:5000/api/v1
```

| Method | Endpoint | Auth | Access | Description |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | Public | Register a user or admin |
| POST | `/auth/login` | No | Public | Login and receive JWT |
| GET | `/auth/me` | Yes | User/Admin | Get current authenticated user |
| GET | `/tasks` | Yes | User/Admin | User gets own tasks; admin gets all tasks |
| POST | `/tasks` | Yes | User/Admin | Create a task owned by current user |
| GET | `/tasks/:id` | Yes | Owner/Admin | Get one task |
| PATCH | `/tasks/:id` | Yes | Owner/Admin | Update one task |
| DELETE | `/tasks/:id` | Yes | Owner/Admin | Delete one task |

## Example Requests

Register:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "user"
}
```

Login:

```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

Create task:

```json
{
  "title": "Finish assignment",
  "description": "Build backend, frontend, and docs",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-05-15T00:00:00.000Z"
}
```

Authenticated requests must include:

```text
Authorization: Bearer <jwt_token>
```

## Role Behavior

- `user`: can create, read, update, and delete only tasks they own.
- `admin`: can view all users' tasks and manage tasks through the same task endpoints.

## Validation and Error Handling

- `express-validator` validates and sanitizes request bodies and route params.
- Mongoose schema validation protects persisted data.
- All route errors flow through centralized error middleware.
- Error responses follow this shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Security Note

- Passwords are hashed with bcryptjs before storage.
- JWTs are required for protected routes and sent by the frontend through the `Authorization` header.
- Helmet and API rate limiting are enabled.
- Keep `JWT_SECRET` long, random, and outside source control.
- This demo allows selecting `admin` during registration so RBAC can be tested quickly. In production, admin creation should be restricted to a seed script, invite flow, or trusted internal admin action.
- Storing JWTs in `localStorage` is simple for assignments but can be exposed by XSS. Production systems should add strong CSP, careful output handling, short token lifetimes, refresh-token rotation, and consider httpOnly secure cookies.

## Scalability Note

- The API is versioned under `/api/v1`, so future breaking changes can be introduced through `/api/v2`.
- Controllers, routes, validations, middleware, models, and config are separated to keep feature growth manageable.
- Task queries are indexed by `owner` and `createdAt`, which supports common per-user dashboard reads.
- For larger deployments, add pagination and filtering to `GET /tasks`, use centralized logging, background workers for heavy jobs, Redis-backed rate limiting, and horizontal API scaling behind a load balancer.
