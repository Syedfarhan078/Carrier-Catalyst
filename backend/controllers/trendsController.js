/**
 * ═══════════════════════════════════════════════════════════════
 * TRENDS CONTROLLER
 * Simulates live market demand and job trends for tech careers.
 * Designed to be easily replaced with real scraper/API logic later.
 * ═══════════════════════════════════════════════════════════════
 */

const { sendSuccess } = require("../utils/responses");

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "AI Engineer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer"
];

// Simple in-memory cache to prevent thrashing and simulate "stable" live data
let trendsCache = {
  data: null,
  timestamp: null
};

const CACHE_DURATION_MS = 10000; // 10 seconds

/**
 * GET /api/trends
 * Return simulated market demand trends
 */
const getTrends = (req, res) => {
  const now = Date.now();

  // Return cached data if still valid (under 10 seconds old)
  if (trendsCache.data && trendsCache.timestamp && (now - trendsCache.timestamp < CACHE_DURATION_MS)) {
    return sendSuccess(res, trendsCache.data, 200, "Trends retrieved from cache");
  }

  // Generate dynamic data
  const dynamicData = ROLES.map(role => {
    // Random jobCount between 5,000 and 50,000
    const jobCount = Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000;
    
    // Calculate a trendScore (0-100) based loosely on jobCount with some random noise
    // 50,000 -> base score ~100
    // 5,000  -> base score ~10
    let baseScore = Math.floor((jobCount / 50000) * 100);
    // Add noise +/- 5
    let trendScore = Math.min(100, Math.max(0, baseScore + (Math.floor(Math.random() * 11) - 5)));

    // Random growth between -10% and +25%
    const growth = Math.floor(Math.random() * 36) - 10;

    // Determine demand level
    let demandLevel = "Low";
    if (trendScore >= 70) demandLevel = "High";
    else if (trendScore >= 40) demandLevel = "Medium";

    return {
      role,
      jobCount,
      trendScore,
      growth,
      demandLevel,
      lastUpdated: new Date().toISOString()
    };
  });

  // Sort by trendScore DESC
  const sortedTrends = dynamicData.sort((a, b) => b.trendScore - a.trendScore);

  // Update cache
  trendsCache = {
    data: sortedTrends,
    timestamp: now
  };

  sendSuccess(res, sortedTrends, 200, "Live trends generated successfully");
};

module.exports = { getTrends };
