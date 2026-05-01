/**
 * ═══════════════════════════════════════════════════════════════
 * USER CONTROLLER
 * Handles fetching user data. Passwords are always stripped
 * from responses to prevent accidental exposure.
 * ═══════════════════════════════════════════════════════════════
 */

const users = require("../data/users");
const { sendSuccess, sendError } = require("../utils/responses");

/**
 * GET /api/users
 * Return all registered users (without passwords)
 *
 * Supports optional query filters:
 *   ?career=datascience → filter by selected career
 */
const getAllUsers = (req, res) => {
  let result = users;

  // Optional: filter by career query parameter
  const { career } = req.query;
  if (career) {
    result = result.filter(
      (u) => u.career && u.career.toLowerCase() === career.toLowerCase()
    );
  }

  // Strip passwords from every user object before sending
  const safeUsers = result.map(({ password, ...user }) => user);

  sendSuccess(res, {
    users: safeUsers,
    total: safeUsers.length,
  });
};

/**
 * GET /api/users/:id
 * Return a single user by their ID (without password)
 */
const getUserById = (req, res) => {
  // Parse the ID from the URL parameter
  const id = parseInt(req.params.id, 10);

  // Validate that the ID is a valid number
  if (isNaN(id)) {
    return sendError(res, "User ID must be a number", 400, "INVALID_ID");
  }

  // Find the user
  const user = users.find((u) => u.id === id);

  if (!user) {
    return sendError(res, `User with ID ${id} not found`, 404, "USER_NOT_FOUND");
  }

  // Strip password before sending
  const { password, ...safeUser } = user;
  sendSuccess(res, safeUser);
};

module.exports = { getAllUsers, getUserById };
