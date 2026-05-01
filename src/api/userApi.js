/**
 * ═══════════════════════════════════════════════════════════════
 * USER API
 * Fetches user data from the backend.
 *
 * Usage:
 *   import { fetchUsers, fetchUserById } from "../api/userApi";
 *   const users = await fetchUsers();
 *   const user  = await fetchUserById(1);
 * ═══════════════════════════════════════════════════════════════
 */

import api from "./axiosConfig";

/**
 * Fetch all users from the backend
 * @param {string} [career] — Optional career filter (e.g., "datascience")
 * @returns {Promise<{users: array, total: number}>}
 */
export const fetchUsers = async (career = null) => {
  const params = {};
  if (career) params.career = career;

  const response = await api.get("/users", { params });
  return response.data.data; // { users: [...], total: N }
};

/**
 * Fetch a single user by their ID
 * @param {number} id — User ID
 * @returns {Promise<object>} — User object (without password)
 */
export const fetchUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};
