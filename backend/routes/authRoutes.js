/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH ROUTES
 * Maps URL paths to auth controller functions.
 * Validation middleware runs BEFORE the controller.
 *
 * POST /api/auth/signup  → Register a new account
 * POST /api/auth/login   → Log in to an existing account
 * ═══════════════════════════════════════════════════════════════
 */

const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validator");

// Signup: validate input first, then create the account
router.post("/signup", validateSignup, signup);

// Login: validate input first, then authenticate
router.post("/login", validateLogin, login);

module.exports = router;
