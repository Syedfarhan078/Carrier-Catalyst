/**
 * ═══════════════════════════════════════════════════════════════
 * MENTOR API
 * Fetches mentor data from the backend.
 * Falls back to local mentorsData.js if the API is unreachable,
 * so the app never breaks even if the backend is down.
 *
 * Usage:
 *   import { fetchMentors, fetchMentorById } from "../api/mentorApi";
 *   const { mentors } = await fetchMentors({ skill: "React" });
 *   const mentor = await fetchMentorById(3);
 * ═══════════════════════════════════════════════════════════════
 */

import api from "./axiosConfig";
import { mentorsData as localMentors } from "../data/mentorsData";

/**
 * Fetch all mentors from the backend with optional filters
 * @param {object}  options
 * @param {string}  [options.skill]     — Filter by skill (e.g., "React")
 * @param {string}  [options.sort]      — Sort by "rating", "experience", or "price"
 * @param {number}  [options.minRating] — Minimum rating filter
 * @returns {Promise<{mentors: array, total: number}>}
 */
export const fetchMentors = async ({ skill, sort, minRating } = {}) => {
  try {
    const params = {};
    if (skill) params.skill = skill;
    if (sort) params.sort = sort;
    if (minRating) params.minRating = minRating;

    const response = await api.get("/mentors", { params });
    return response.data.data; // { mentors: [...], total: N, filters: {...} }
  } catch (error) {
    // Fallback to local data if backend is unreachable
    console.warn("[MentorAPI] Backend unreachable, using local fallback data");
    return { mentors: localMentors, total: localMentors.length };
  }
};

/**
 * Fetch a single mentor by their ID
 * @param {number} id — Mentor ID
 * @returns {Promise<object>} — Full mentor profile
 */
export const fetchMentorById = async (id) => {
  try {
    const response = await api.get(`/mentors/${id}`);
    return response.data.data;
  } catch (error) {
    // Fallback: find mentor in local data
    console.warn("[MentorAPI] Backend unreachable, using local fallback");
    const local = localMentors.find((m) => m.id === parseInt(id));
    if (local) return local;
    throw error; // Re-throw if not found locally either
  }
};
