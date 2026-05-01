/**
 * ═══════════════════════════════════════════════════════════════
 * PROGRESS CONTROLLER
 * Handles reading and updating user learning progress.
 * Each user can have one progress entry per career track.
 * ═══════════════════════════════════════════════════════════════
 */

const progress = require("../data/progress");
const users = require("../data/users");
const { sendSuccess, sendError } = require("../utils/responses");

/**
 * GET /api/progress/:userId
 * Get the learning progress for a specific user
 */
const getProgress = (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return sendError(res, "User ID must be a number", 400, "INVALID_ID");
  }

  // Verify the user exists
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return sendError(res, `User with ID ${userId} not found`, 404, "USER_NOT_FOUND");
  }

  // Find progress for this user
  const userProgress = progress.find((p) => p.userId === userId);

  if (!userProgress) {
    // User exists but hasn't started any career track yet
    return sendSuccess(res, {
      userId,
      career: null,
      completedTopics: [],
      currentPhase: null,
      lastActive: null,
      streakDays: 0,
      totalHours: 0,
      message: "No progress found. Start a career track to begin tracking!",
    });
  }

  // Calculate completion percentage based on a standard roadmap of ~15 topics
  const estimatedTotalTopics = 15;
  const completionPct = Math.min(
    100,
    Math.round((userProgress.completedTopics.length / estimatedTotalTopics) * 100)
  );

  sendSuccess(res, {
    ...userProgress,
    completionPercentage: completionPct,
  });
};

/**
 * POST /api/progress
 * Create or update learning progress for a user
 *
 * Request body:
 *   {
 *     userId: 1,
 *     career: "datascience",
 *     completedTopics: ["Python Basics", "Statistics & Probability"],
 *     currentPhase: "Foundation"
 *   }
 */
const updateProgress = (req, res) => {
  const { userId, career, completedTopics, currentPhase } = req.body;

  // Verify the user exists
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return sendError(res, `User with ID ${userId} not found`, 404, "USER_NOT_FOUND");
  }

  // Check if this user already has a progress entry
  const existingIndex = progress.findIndex((p) => p.userId === userId);

  if (existingIndex !== -1) {
    // ── UPDATE existing progress ──
    const existing = progress[existingIndex];

    // Merge new completed topics with existing ones (no duplicates)
    const mergedTopics = completedTopics
      ? [...new Set([...existing.completedTopics, ...completedTopics])]
      : existing.completedTopics;

    // Calculate streak (if last active was yesterday, increment; else reset)
    const lastActiveDate = new Date(existing.lastActive);
    const now = new Date();
    const hoursDiff = (now - lastActiveDate) / (1000 * 60 * 60);
    let newStreak = existing.streakDays;
    if (hoursDiff < 48) {
      // Active within last 2 days — keep or increment streak
      newStreak = hoursDiff > 20 ? existing.streakDays + 1 : existing.streakDays;
    } else {
      // Streak broken
      newStreak = 1;
    }

    // Build the updated progress object
    progress[existingIndex] = {
      ...existing,
      career: career || existing.career,
      completedTopics: mergedTopics,
      currentPhase: currentPhase || existing.currentPhase,
      lastActive: now.toISOString(),
      streakDays: newStreak,
      totalHours: existing.totalHours + 1, // Increment by 1 hour per update
    };

    // Also update the user's career field
    if (career) user.career = career;

    return sendSuccess(
      res,
      progress[existingIndex],
      200,
      "Progress updated successfully"
    );
  }

  // ── CREATE new progress entry ──
  const newProgress = {
    userId,
    career,
    completedTopics: completedTopics || [],
    currentPhase: currentPhase || "Foundation",
    lastActive: new Date().toISOString(),
    streakDays: 1,
    totalHours: 0,
  };

  progress.push(newProgress);

  // Update the user's career field
  user.career = career;

  sendSuccess(res, newProgress, 201, "Progress tracking started");
};

module.exports = { getProgress, updateProgress };
