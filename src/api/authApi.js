/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH API
 * Handles login, signup, and token management.
 *
 * Usage in components:
 *   import { loginUser, signupUser } from "../api/authApi";
 *   const { user, token } = await loginUser(email, password);
 * ═══════════════════════════════════════════════════════════════
 */

import api from "./axiosConfig";

/**
 * Log in an existing user
 * @param {string} email    — User's email
 * @param {string} password — User's password
 * @returns {Promise<{user: object, token: string}>}
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  const { user, token } = response.data.data;

  // Store token and user in localStorage for session persistence
  localStorage.setItem("auth_token", token);
  localStorage.setItem("current_user", JSON.stringify(user));

  return { user, token };
};

/**
 * Register a new user
 * @param {string} name     — User's full name
 * @param {string} email    — User's email
 * @param {string} password — User's chosen password
 * @returns {Promise<{user: object, token: string}>}
 */
export const signupUser = async (name, email, password) => {
  const response = await api.post("/auth/signup", { name, email, password });
  const { user, token } = response.data.data;

  // Store token (but don't auto-login — let the UI redirect to sign in)
  localStorage.setItem("auth_token", token);

  return { user, token };
};

/**
 * Log out — clear all stored auth data
 */
export const logoutUser = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("current_user");
};

/**
 * Get the currently stored auth token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem("auth_token");
};

/**
 * Get the currently stored user from localStorage
 * @returns {object|null}
 */
export const getStoredUser = () => {
  const saved = localStorage.getItem("current_user");
  return saved ? JSON.parse(saved) : null;
};
