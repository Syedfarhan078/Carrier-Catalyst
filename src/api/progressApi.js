/**
 * ═══════════════════════════════════════════════════════════════
 * PROGRESS API
 * Handles reading and updating user learning progress.
 *
 * Usage:
 *   import { fetchProgress, updateProgress } from "../api/progressApi";
 *   const data = await fetchProgress(userId);
 *   await updateProgress({ userId, career, completedTopics, currentPhase });
 * ═══════════════════════════════════════════════════════════════
 */

import api from "./axiosConfig";

/**
 * Fetch learning progress for a user
 * @param {number} userId — The user's ID
 * @returns {Promise<object>} — Progress data with completedTopics, career, etc.
 */
export const fetchProgress = async (userId) => {
  const response = await api.get(`/progress/${userId}`);
  return response.data.data;
};

/**
 * Create or update a user's learning progress
 * @param {object}   data
 * @param {number}   data.userId          — User ID
 * @param {string}   data.career          — Career track key (e.g., "datascience")
 * @param {string[]} data.completedTopics — Array of completed topic names
 * @param {string}   data.currentPhase    — Current learning phase name
 * @returns {Promise<object>} — Updated progress data
 */
export const updateProgress = async ({ userId, career, completedTopics, currentPhase }) => {
  const response = await api.post("/progress", {
    userId,
    career,
    completedTopics,
    currentPhase,
  });
  return response.data.data;
};
