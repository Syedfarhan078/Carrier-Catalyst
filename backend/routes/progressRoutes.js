/**
 * ═══════════════════════════════════════════════════════════════
 * PROGRESS ROUTES
 * Maps URL paths to progress controller functions.
 *
 * GET  /api/progress/:userId  → Get a user's learning progress
 * POST /api/progress          → Create or update progress
 * ═══════════════════════════════════════════════════════════════
 */

const express = require("express");
const router = express.Router();
const { getProgress, updateProgress } = require("../controllers/progressController");
const { validateProgress } = require("../middleware/validator");

// Get progress for a specific user
router.get("/:userId", getProgress);

// Create or update progress (validate first)
router.post("/", validateProgress, updateProgress);

module.exports = router;
