/**
 * ═══════════════════════════════════════════════════════════════
 * REQUEST LOGGER MIDDLEWARE
 * Logs every incoming HTTP request with timestamp, method,
 * URL, and response time. Essential for debugging and monitoring.
 *
 * Output format:
 *   [2026-05-01 09:30:15] GET /api/mentors → 200 (12ms)
 * ═══════════════════════════════════════════════════════════════
 */

const logger = (req, res, next) => {
  // Capture the start time
  const start = Date.now();

  // Format timestamp as YYYY-MM-DD HH:MM:SS
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  // Listen for when the response finishes to calculate duration
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 400
        ? "\x1b[31m" // Red for errors
        : res.statusCode >= 300
          ? "\x1b[33m" // Yellow for redirects
          : "\x1b[32m"; // Green for success
    const reset = "\x1b[0m";

    console.log(
      `  ${statusColor}[${now}]${reset} ${req.method} ${req.originalUrl} → ${statusColor}${res.statusCode}${reset} (${duration}ms)`
    );
  });

  // Pass control to the next middleware/route handler
  next();
};

module.exports = logger;
