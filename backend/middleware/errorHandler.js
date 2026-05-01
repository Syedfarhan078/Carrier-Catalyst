/**
 * ═══════════════════════════════════════════════════════════════
 * GLOBAL ERROR HANDLER MIDDLEWARE
 * Catches any unhandled errors thrown in route handlers.
 * This prevents the server from crashing and sends a clean
 * JSON error response to the client.
 *
 * Must be registered AFTER all routes in server.js:
 *   app.use(errorHandler);
 *
 * ⚠️  Express identifies error-handling middleware by its
 *     4-parameter signature: (err, req, res, next)
 * ═══════════════════════════════════════════════════════════════
 */

const errorHandler = (err, req, res, next) => {
  // Log the full error stack for debugging (server-side only)
  console.error("\x1b[31m[ERROR]\x1b[0m", err.stack || err.message);

  // Determine the status code
  // If the error has a statusCode property, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // Send a clean JSON error response to the client
  // Never expose internal error details in production
  res.status(statusCode).json({
    success: false,
    error: {
      message:
        statusCode === 500
          ? "Internal server error. Please try again later."
          : err.message,
      code: err.code || "SERVER_ERROR",
    },
  });
};

module.exports = errorHandler;
