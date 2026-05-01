/**
 * ═══════════════════════════════════════════════════════════════
 * STANDARDIZED API RESPONSE HELPERS
 * Every API endpoint should return a consistent JSON shape.
 * This makes it easy for the React frontend to parse responses.
 *
 * Success shape:  { success: true,  data: ... }
 * Error shape:    { success: false, error: { message, code } }
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Send a successful JSON response
 * @param {object} res     - Express response object
 * @param {*}      data    - The payload to send
 * @param {number} status  - HTTP status code (default: 200)
 * @param {string} message - Optional success message
 */
const sendSuccess = (res, data, status = 200, message = null) => {
  const response = { success: true, data };
  if (message) response.message = message;
  return res.status(status).json(response);
};

/**
 * Send an error JSON response
 * @param {object} res     - Express response object
 * @param {string} message - Human-readable error message
 * @param {number} status  - HTTP status code (default: 400)
 * @param {string} code    - Machine-readable error code
 */
const sendError = (res, message, status = 400, code = "BAD_REQUEST") => {
  return res.status(status).json({
    success: false,
    error: { message, code },
  });
};

module.exports = { sendSuccess, sendError };
