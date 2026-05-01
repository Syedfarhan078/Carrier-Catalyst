/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH CONTEXT (Updated for Backend API)
 * Provides user state and auth actions to the entire app.
 *
 * Changes from localStorage version:
 *   - Now stores auth token alongside user data
 *   - logout() also clears the auth token
 *   - getStoredUser() is used for hydration on mount
 * ═══════════════════════════════════════════════════════════════
 */

import { createContext, useContext, useState } from "react";
import { getStoredUser, logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Hydrate user from localStorage on first mount (persists across refreshes)
  const [user, setUser] = useState(() => getStoredUser());

  // Called after a successful login or signup API call
  const login = (u) => {
    setUser(u);
    localStorage.setItem("current_user", JSON.stringify(u));
  };

  // Clear all auth state and tokens
  const logout = () => {
    setUser(null);
    logoutUser(); // Clears both token and user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
