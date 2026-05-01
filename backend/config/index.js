/**
 * ═══════════════════════════════════════════════════════════════
 * APPLICATION CONFIGURATION
 * Central place for all config values. In production, these
 * would come from environment variables (process.env).
 * ═══════════════════════════════════════════════════════════════
 */

const config = {
  // Server port — defaults to 5000 if no env variable is set
  PORT: process.env.PORT || 5000,

  // Frontend origin — used by CORS to allow requests from your React app
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",

  // Secret used to generate mock tokens (in production, use a real JWT secret)
  TOKEN_SECRET: process.env.TOKEN_SECRET || "career-catalyst-secret-2026",
};

module.exports = config;
