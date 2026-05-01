/**
 * ═══════════════════════════════════════════════════════════════
 * MENTOR ROUTES
 * Maps URL paths to mentor controller functions.
 *
 * GET /api/mentors      → List all mentors (with filters & sorting)
 * GET /api/mentors/:id  → Get a specific mentor's full profile
 * ═══════════════════════════════════════════════════════════════
 */

const express = require("express");
const router = express.Router();
const { getAllMentors, getMentorById } = require("../controllers/mentorController");

// Get all mentors (supports ?skill=React&sort=rating&minRating=4.5)
router.get("/", getAllMentors);

// Get a single mentor by their ID
router.get("/:id", getMentorById);

module.exports = router;
