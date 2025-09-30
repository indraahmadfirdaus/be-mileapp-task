# MileApp Fullstack Developer Test - Backend

A RESTful API built with Express.js and Node.js for task management with authentication.

## 🚀 Features

- **Authentication System**: JWT-based authentication with login and register
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Advanced Filtering**: Filter tasks by status, priority, and search query
- **Sorting**: Sort tasks by any field (ascending/descending)
- **Pagination**: Efficient data pagination with metadata
- **Mock Database**: In-memory data storage using ES6 classes
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Protected Routes**: Middleware-based route protection

## 📦 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── models/
│   │   ├── Task.js          # Task model with static methods
│   │   └── User.js          # User model with authentication
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── error.middleware.js   # Error handler
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── task.controller.js    # Task CRUD logic
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   └── task.routes.js        # Task endpoints
│   ├── utils/
│   │   └── response.js           # Response helpers
│   └── app.js                    # Express app setup
├── db/
│   └── indexes.js                # MongoDB index definitions
├── .env.example
├── .gitignore
├── package.json
└── server.js                     # Entry point
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5151
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

4. **Run the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5151`

## 📚 API Documentation

### Authentication Endpoints

#### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@mileapp.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@mileapp.com",
      "name": "Admin User"
    }
  }
}
```

#### 2. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@mileapp.com",
  "password": "password123",
  "name": "New User"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

All task endpoints require authentication via Bearer token.

#### 1. Get All Tasks (with filtering, sorting, pagination)
```http
GET /api/tasks?status=pending&priority=high&search=project&sortBy=createdAt&order=desc&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `search` - Search in title and description
- `sortBy` - Sort field (createdAt, title, priority, etc.)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Setup Project",
      "description": "Initialize project",
      "status": "completed",
      "priority": "high",
      "dueDate": "2025-09-25",
      "userId": 1,
      "createdAt": "2025-09-20T10:00:00.000Z",
      "updatedAt": "2025-09-25T15:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### 2. Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### 3. Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-10-15"
}
```

#### 4. Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "in-progress",
  "priority": "high"
}
```

#### 5. Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### 6. Get Task Statistics
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 5,
    "pending": 3,
    "inProgress": 1,
    "completed": 1,
    "highPriority": 2
  }
}
```

## 🔐 Mock Users

The application comes with two pre-configured users:

| Email | Password | Name |
|-------|----------|------|
| admin@mileapp.com | admin123 | Admin User |
| user@mileapp.com | user123 | Regular User |

## 💾 Database Indexes

The `db/indexes.js` file contains MongoDB index definitions optimized for:

1. **Email Lookup** - Unique index on user emails for fast authentication
2. **User Tasks** - Compound indexes with userId for multi-tenancy
3. **Status Filtering** - Quick filtering by task status
4. **Priority Filtering** - Efficient priority-based queries
5. **Due Date Queries** - Optimized date range searches
6. **Full-Text Search** - Text search across titles and descriptions
7. **Sorting** - Indexes for common sort operations

### Key Design Decisions:

- **Compound indexes starting with userId**: Since every query filters by userId first (data isolation)
- **Text indexes on title and description**: Enables powerful search functionality
- **Multiple sort indexes**: Supports various sorting requirements without performance impact

## 🎯 Design Decisions

### 1. Class-Based Models
Used ES6 classes for models instead of a real database to demonstrate:
- Clean object-oriented design
- Static methods for database operations
- Easy to understand and maintain
- Simple to migrate to real MongoDB later

### 2. Mock Data Storage
- In-memory arrays simulate database tables
- Pre-populated with sample data for testing
- Auto-incrementing IDs
- Realistic data relationships

### 3. Middleware Architecture
- **Auth Middleware**: JWT verification on protected routes
- **Error Middleware**: Centralized error handling
- Separation of concerns

### 4. Response Helpers
Standardized response format across all endpoints:
- `successResponse()` - Success with data
- `errorResponse()` - Error with message
- `paginatedResponse()` - Paginated data with metadata

### 5. Security
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Token expiration handling

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

2. Connect your GitHub repo to Render

### Environment Variables for Production

Set these in your deployment platform:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRE=7d
```

## 🧪 Testing

You can test the API using:

1. **Postman/Insomnia**
   - Import the provided collection
   - Set base URL and token

2. **cURL**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mileapp.com","password":"admin123"}'

# Get Tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your-token>"
```

## 📝 Module Strengths

1. **Scalability**: Clean architecture ready for real database integration
2. **Performance**: Efficient filtering, sorting, and pagination
3. **Security**: JWT authentication with bcrypt password hashing
4. **Error Handling**: Comprehensive error handling with proper status codes
5. **Code Quality**: Well-organized, documented, and maintainable code
6. **API Design**: RESTful principles with consistent response formats
7. **Flexibility**: Easily extendable for additional features

## 📄 License

MIT

## 👤 Author

@indraahmadfirdaus - Fullstack Developer Test for MileApp