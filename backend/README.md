# 🚀 Career Catalyst — Backend API

A clean, modular Express.js backend server for the Career Catalyst career guidance platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (auto-reload on file changes)
npm run dev

# Start production server
npm start
```

The server runs on **http://localhost:5000** by default.

---

## 📁 Project Structure

```
backend/
├── server.js                 # Entry point — wires everything together
├── package.json              # Dependencies & scripts
├── config/
│   └── index.js              # Centralized configuration
├── data/
│   ├── users.js              # In-memory user data
│   ├── mentors.js            # In-memory mentor data
│   └── progress.js           # In-memory progress data
├── controllers/
│   ├── authController.js     # Signup & login logic
│   ├── userController.js     # User CRUD logic
│   ├── mentorController.js   # Mentor queries & filters
│   └── progressController.js # Progress tracking logic
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── userRoutes.js         # User endpoints
│   ├── mentorRoutes.js       # Mentor endpoints
│   └── progressRoutes.js     # Progress endpoints
├── middleware/
│   ├── logger.js             # Request logging
│   ├── errorHandler.js       # Global error handler
│   └── validator.js          # Input validation
├── utils/
│   ├── responses.js          # Standardized JSON responses
│   └── generateToken.js      # Mock token generation
└── test-api.js               # API integration tests
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description           | Body                          |
|--------|--------------------|-----------------------|-------------------------------|
| POST   | `/api/auth/signup` | Register new user     | `{ name, email, password }`   |
| POST   | `/api/auth/login`  | Login existing user   | `{ email, password }`         |

### Users
| Method | Endpoint          | Description              | Query Params       |
|--------|-------------------|--------------------------|--------------------|
| GET    | `/api/users`      | List all users           | `?career=webdev`   |
| GET    | `/api/users/:id`  | Get single user by ID    | —                  |

### Mentors
| Method | Endpoint            | Description               | Query Params                       |
|--------|---------------------|---------------------------|------------------------------------|
| GET    | `/api/mentors`      | List all mentors          | `?skill=React&sort=rating&minRating=4.5` |
| GET    | `/api/mentors/:id`  | Get single mentor by ID   | —                                  |

### Progress
| Method | Endpoint               | Description            | Body                                          |
|--------|------------------------|------------------------|-----------------------------------------------|
| GET    | `/api/progress/:userId`| Get user progress      | —                                             |
| POST   | `/api/progress`        | Update user progress   | `{ userId, career, completedTopics, currentPhase }` |

---

## 🔗 Connecting to React Frontend

In your React app, use `fetch` or `axios`:

```javascript
// Example: Login
const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "farhan@example.com", password: "password123" }),
});
const data = await res.json();
console.log(data.data.token); // Auth token

// Example: Get mentors filtered by skill
const mentors = await fetch("http://localhost:5000/api/mentors?skill=React&sort=rating");
const result = await mentors.json();
console.log(result.data.mentors);
```

---

## 🧪 Run Tests

```bash
node test-api.js
```

---

## Response Format

All responses follow a consistent shape:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "code": "MACHINE_READABLE_CODE"
  }
}
```
