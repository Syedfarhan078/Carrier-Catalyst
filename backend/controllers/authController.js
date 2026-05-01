/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH CONTROLLER
 * Handles user registration (signup) and authentication (login).
 * All business logic for auth lives here — routes just wire
 * URLs to these functions.
 * ═══════════════════════════════════════════════════════════════
 */

const users = require("../data/users");
const { generateToken } = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responses");

/**
 * POST /api/auth/signup
 * Register a new user account
 *
 * Request body: { name, email, password }
 * Response:     { user, token }
 */
const signup = (req, res) => {
  const { name, email, password } = req.body;

  // Check if email is already taken
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) {
    return sendError(res, "An account with this email already exists", 409, "EMAIL_TAKEN");
  }

  // Create the new user object
  const newUser = {
    id: users.length + 1, // Simple auto-increment (use UUID in production)
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password, // ⚠️ In production: hash with bcrypt before storing!
    career: null,
    joinedAt: new Date().toISOString(),
  };

  // Add to our in-memory "database"
  users.push(newUser);

  // Generate an auth token for immediate login after signup
  const token = generateToken(newUser);

  // Return user data (without password) and the token
  const { password: _, ...safeUser } = newUser;
  sendSuccess(
    res,
    { user: safeUser, token },
    201,
    "Account created successfully"
  );
};

/**
 * POST /api/auth/login
 * Authenticate an existing user
 *
 * Request body: { email, password }
 * Response:     { user, token }
 */
const login = (req, res) => {
  const { email, password } = req.body;

  // Find user by email (case-insensitive)
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  // Check if user exists
  if (!user) {
    return sendError(res, "No account found with this email", 401, "USER_NOT_FOUND");
  }

  // Verify password (plain comparison for demo — use bcrypt.compare in production)
  if (user.password !== password) {
    return sendError(res, "Incorrect password", 401, "INVALID_PASSWORD");
  }

  // Generate auth token
  const token = generateToken(user);

  // Return user data (without password) and the token
  const { password: _, ...safeUser } = user;
  sendSuccess(res, { user: safeUser, token }, 200, "Login successful");
};

module.exports = { signup, login };
