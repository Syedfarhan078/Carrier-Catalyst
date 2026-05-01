/**
 * ═══════════════════════════════════════════════════════════════
 *   ██████╗ █████╗ ██████╗ ███████╗███████╗██████╗
 *  ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗
 *  ██║     ███████║██████╔╝█████╗  █████╗  ██████╔╝
 *  ██║     ██╔══██║██╔══██╗██╔══╝  ██╔══╝  ██╔══██╗
 *  ╚██████╗██║  ██║██║  ██║███████╗███████╗██║  ██║
 *   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
 *   ██████╗ █████╗ ████████╗ █████╗ ██╗     ██╗   ██╗███████╗████████╗
 *  ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║     ╚██╗ ██╔╝██╔════╝╚══██╔══╝
 *  ██║     ███████║   ██║   ███████║██║      ╚████╔╝ ███████╗   ██║
 *  ██║     ██╔══██║   ██║   ██╔══██║██║       ╚██╔╝  ╚════██║   ██║
 *  ╚██████╗██║  ██║   ██║   ██║  ██║███████╗   ██║   ███████║   ██║
 *   ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝   ╚═╝
 *
 *  Career Catalyst — Backend API Server
 *  A clean, modular Express.js server for career guidance
 *
 *  Run:  npm start       (production)
 *        npm run dev     (development with auto-reload)
 *
 *  API Base URL: http://localhost:5000/api
 * ═══════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────────────────────
// 1. IMPORTS
// ──────────────────────────────────────────────────────────────
const express = require("express");
const cors = require("cors");
const config = require("./config");

// Middleware
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Route modules
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const progressRoutes = require("./routes/progressRoutes");

// ──────────────────────────────────────────────────────────────
// 2. CREATE EXPRESS APP
// ──────────────────────────────────────────────────────────────
const app = express();

// ──────────────────────────────────────────────────────────────
// 3. GLOBAL MIDDLEWARE
//    These run on EVERY request, in the order they are registered.
// ──────────────────────────────────────────────────────────────

// Enable CORS — allows the React frontend (port 3000) to call this API (port 5000)
app.use(
  cors({
    origin: config.CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON request bodies (e.g., from fetch or axios)
app.use(express.json());

// Parse URL-encoded form data (for traditional HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Log every request with method, URL, status, and response time
app.use(logger);

// ──────────────────────────────────────────────────────────────
// 4. API ROUTES
//    Each route module handles a specific domain of the app.
//    All routes are prefixed with /api for clarity.
// ──────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);         // POST /api/auth/signup, POST /api/auth/login
app.use("/api/users", userRoutes);        // GET  /api/users, GET /api/users/:id
app.use("/api/mentors", mentorRoutes);    // GET  /api/mentors, GET /api/mentors/:id
app.use("/api/progress", progressRoutes); // GET  /api/progress/:userId, POST /api/progress

// ──────────────────────────────────────────────────────────────
// 5. HEALTH CHECK & API INFO
//    A simple endpoint to verify the server is running.
//    Useful for monitoring tools, load balancers, and CI/CD.
// ──────────────────────────────────────────────────────────────

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Career Catalyst API is running",
    version: "1.0.0",
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
      },
      users: {
        list: "GET /api/users",
        detail: "GET /api/users/:id",
      },
      mentors: {
        list: "GET /api/mentors",
        detail: "GET /api/mentors/:id",
      },
      progress: {
        get: "GET /api/progress/:userId",
        update: "POST /api/progress",
      },
    },
    documentation: "See README.md for full API documentation",
  });
});

// ──────────────────────────────────────────────────────────────
// 6. 404 HANDLER
//    Catch any request that doesn't match a defined route.
//    Must be placed AFTER all route definitions.
// ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: "NOT_FOUND",
      hint: "Visit GET /api to see all available endpoints",
    },
  });
});

// ──────────────────────────────────────────────────────────────
// 7. GLOBAL ERROR HANDLER
//    Catches any unhandled errors thrown in route handlers.
//    Must be the LAST middleware registered.
// ──────────────────────────────────────────────────────────────

app.use(errorHandler);

// ──────────────────────────────────────────────────────────────
// 8. START THE SERVER
// ──────────────────────────────────────────────────────────────

app.listen(config.PORT, () => {
  console.log("");
  console.log("  ══════════════════════════════════════════════════");
  console.log("  ✦  Career Catalyst API Server");
  console.log("  ══════════════════════════════════════════════════");
  console.log(`  ✓  Server running on    http://localhost:${config.PORT}`);
  console.log(`  ✓  API base URL         http://localhost:${config.PORT}/api`);
  console.log(`  ✓  CORS origin          ${config.CLIENT_ORIGIN}`);
  console.log(`  ✓  Environment          ${process.env.NODE_ENV || "development"}`);
  console.log("  ══════════════════════════════════════════════════");
  console.log("");
});
