/**
 * ═══════════════════════════════════════════════════════════════
 * MENTOR CONTROLLER
 * Handles fetching mentor profiles. Supports filtering by
 * skills and sorting by rating or experience.
 * ═══════════════════════════════════════════════════════════════
 */

const mentors = require("../data/mentors");
const { sendSuccess, sendError } = require("../utils/responses");

/**
 * GET /api/mentors
 * Return all mentors with optional filters
 *
 * Query parameters:
 *   ?skill=React       → filter mentors who have this skill
 *   ?sort=rating       → sort by rating (descending)
 *   ?sort=experience   → sort by years of experience (descending)
 *   ?sort=price        → sort by hourly rate (ascending)
 *   ?minRating=4.5     → only mentors with rating >= 4.5
 */
const getAllMentors = (req, res) => {
  let result = [...mentors]; // Create a copy so we don't mutate the original

  const { skill, sort, minRating } = req.query;

  // Filter by skill (case-insensitive partial match)
  if (skill) {
    result = result.filter((m) =>
      m.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  // Filter by minimum rating
  if (minRating) {
    const min = parseFloat(minRating);
    if (!isNaN(min)) {
      result = result.filter((m) => m.rating >= min);
    }
  }

  // Sort results
  if (sort) {
    switch (sort.toLowerCase()) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        result.sort((a, b) => b.experience - a.experience);
        break;
      case "price":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      default:
        // Unknown sort param — ignore, keep default order
        break;
    }
  }

  sendSuccess(res, {
    mentors: result,
    total: result.length,
    filters: { skill: skill || null, sort: sort || null },
  });
};

/**
 * GET /api/mentors/:id
 * Return a single mentor by their ID
 */
const getMentorById = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return sendError(res, "Mentor ID must be a number", 400, "INVALID_ID");
  }

  const mentor = mentors.find((m) => m.id === id);

  if (!mentor) {
    return sendError(
      res,
      `Mentor with ID ${id} not found`,
      404,
      "MENTOR_NOT_FOUND"
    );
  }

  sendSuccess(res, mentor);
};

module.exports = { getAllMentors, getMentorById };
