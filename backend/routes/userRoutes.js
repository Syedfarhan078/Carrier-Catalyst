/**
 * ═══════════════════════════════════════════════════════════════
 * USER ROUTES
 * Maps URL paths to user controller functions.
 *
 * GET /api/users      → List all users (with optional filters)
 * GET /api/users/:id  → Get a single user by ID
 * ═══════════════════════════════════════════════════════════════
 */

const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById } = require("../controllers/userController");

// Get all users (supports ?career=datascience filter)
router.get("/", getAllUsers);

// Get a single user by their ID
router.get("/:id", getUserById);

module.exports = router;
