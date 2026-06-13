/**
 * @file axios.js
 * @description Axios instance pre-configured for the CRM API.
 *
 * - Sets base URL from Vite env (falls back to /api for Vite proxy)
 * - Attaches Authorization header automatically from localStorage
 * - Handles 401 responses by clearing auth state and redirecting to login
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// ── Request Interceptor ────────────────────────────────────────────────────────
// Attach JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────────
// Handle 401 Unauthorized globally — clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("crm_token");
      localStorage.removeItem("crm_user");
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
