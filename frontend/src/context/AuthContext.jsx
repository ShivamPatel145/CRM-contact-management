/**
 * @file AuthContext.jsx
 * @description Global authentication state via React Context.
 *
 * Provides:
 * - user: currently authenticated user object (or null)
 * - token: JWT string (or null)
 * - isAuthenticated: boolean
 * - isLoading: true during initial auth check
 * - login(token, user): persist and set auth state
 * - logout(): clear auth state
 *
 * On mount, reads token + user from localStorage (persisted login).
 * Exports useAuth() hook for convenient consumption in components.
 */

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Rehydrate from localStorage on first render ───────────────────────────
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("crm_token");
      const savedUser = localStorage.getItem("crm_user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // Corrupted storage — clear it
      localStorage.removeItem("crm_token");
      localStorage.removeItem("crm_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Call after successful login/register API response.
   * @param {string} newToken - JWT from server
   * @param {object} userData - User object from server
   */
  const login = (newToken, userData) => {
    localStorage.setItem("crm_token", newToken);
    localStorage.setItem("crm_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  /**
   * Call on user-initiated logout.
   * Clears all auth state and localStorage.
   */
  const logout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access auth context.
 * Must be used within <AuthProvider>.
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
