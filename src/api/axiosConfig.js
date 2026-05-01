/**
 * ═══════════════════════════════════════════════════════════════
 * AXIOS BASE INSTANCE
 * Central HTTP client configuration for all API calls.
 *
 * Features:
 *   - Automatic baseURL prefix (/api)
 *   - Auto-attaches Authorization token from localStorage
 *   - Response interceptor for global error handling (401, etc.)
 *   - Request/response logging in development
 * ═══════════════════════════════════════════════════════════════
 */

import axios from "axios";

// ── Create the base axios instance ──
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// ── REQUEST INTERCEPTOR ──
// Automatically attach the auth token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ──
// Handle common errors globally so individual components don't have to
api.interceptors.response.use(
  // Success: just return the response
  (response) => response,

  // Error: handle globally
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message;

    // 401 Unauthorized — token expired or invalid
    if (status === 401) {
      console.warn("[API] Unauthorized — clearing auth token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_user");
      // Optionally redirect to login (uncomment if needed):
      // window.location.href = "/";
    }

    // Enhance the error object with a user-friendly message
    if (!error.response) {
      // No response means the server is unreachable (Network Error, Connection Refused, CORS)
      error.isNetworkError = true;
      error.displayMessage = "Cannot connect to the server. Please ensure the backend API is running.";
    } else {
      error.displayMessage = error.response?.data?.error?.message || error.message;
    }

    // Log all errors in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${status || 'NETWORK_ERROR'}: ${error.displayMessage}`);
    }

    return Promise.reject(error);
  }
);

export default api;
