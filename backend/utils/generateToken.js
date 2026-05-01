/**
 * ═══════════════════════════════════════════════════════════════
 * MOCK TOKEN GENERATOR
 * Creates a simple Base64-encoded token for demo purposes.
 *
 * ⚠️  In production, replace this with a real JWT library:
 *     const jwt = require('jsonwebtoken');
 *     jwt.sign(payload, secret, { expiresIn: '24h' });
 *
 * The token encodes the user's id, email, and an expiry time
 * so the frontend can decode basic info without an API call.
 * ═══════════════════════════════════════════════════════════════
 */

const config = require("../config");

/**
 * Generate a mock authentication token
 * @param {object} user - The user object (must have id and email)
 * @returns {string} A Base64-encoded mock token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    // Token "expires" 24 hours from now
    exp: Date.now() + 24 * 60 * 60 * 1000,
    // Include a hash of the secret so we can "verify" later
    sig: Buffer.from(config.TOKEN_SECRET).toString("base64").slice(0, 12),
  };

  // Encode the payload as a Base64 string (mimics a JWT structure)
  return Buffer.from(JSON.stringify(payload)).toString("base64");
};

/**
 * Verify a mock token (basic validation)
 * @param {string} token - The token string to verify
 * @returns {object|null} Decoded payload if valid, null if invalid/expired
 */
const verifyToken = (token) => {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    // Check if token has expired
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
