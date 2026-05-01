/**
 * ═══════════════════════════════════════════════════════════════
 * VALIDATION MIDDLEWARE
 * Reusable functions to validate request data before it
 * reaches the controller. Keeps controllers clean and focused.
 *
 * Usage in routes:
 *   router.post("/signup", validateSignup, authController.signup);
 * ═══════════════════════════════════════════════════════════════
 */

const { sendError } = require("../utils/responses");

/**
 * Validate signup request body
 * Requires: name, email, password
 */
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(
      res,
      "All fields are required: name, email, password",
      400,
      "MISSING_FIELDS"
    );
  }

  // Basic email format check (contains @ and a dot after it)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendError(res, "Please provide a valid email address", 400, "INVALID_EMAIL");
  }

  // Password must be at least 6 characters
  if (password.length < 6) {
    return sendError(
      res,
      "Password must be at least 6 characters long",
      400,
      "WEAK_PASSWORD"
    );
  }

  // Name must be at least 2 characters
  if (name.trim().length < 2) {
    return sendError(
      res,
      "Name must be at least 2 characters long",
      400,
      "INVALID_NAME"
    );
  }

  // All checks passed — proceed to the controller
  next();
};

/**
 * Validate login request body
 * Requires: email, password
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(
      res,
      "Both email and password are required",
      400,
      "MISSING_FIELDS"
    );
  }

  next();
};

/**
 * Validate progress update request body
 * Requires: userId, career, completedTopics (array)
 */
const validateProgress = (req, res, next) => {
  const { userId, career, completedTopics } = req.body;

  if (!userId || !career) {
    return sendError(
      res,
      "userId and career are required",
      400,
      "MISSING_FIELDS"
    );
  }

  if (typeof userId !== "number" || userId < 1) {
    return sendError(res, "userId must be a positive number", 400, "INVALID_USER_ID");
  }

  if (completedTopics && !Array.isArray(completedTopics)) {
    return sendError(
      res,
      "completedTopics must be an array of topic names",
      400,
      "INVALID_FORMAT"
    );
  }

  next();
};

module.exports = { validateSignup, validateLogin, validateProgress };
