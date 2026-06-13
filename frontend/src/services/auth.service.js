/**
 * @file auth.service.js
 * @description Frontend API calls for authentication.
 *
 * All functions return the parsed `data` from the API envelope.
 * Error handling (parsing error messages) is done in the components.
 */

import api from "../lib/axios";

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {{ token: string, user: object }}
 */
export const registerApi = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data.data; // { token, user }
};

/**
 * Login with email and password.
 * @param {{ email: string, password: string }} payload
 * @returns {{ token: string, user: object }}
 */
export const loginApi = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data.data; // { token, user }
};

/**
 * Fetch the currently authenticated user's profile.
 * Requires Authorization header (handled by Axios interceptor).
 * @returns {{ user: object }}
 */
export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data.data; // { user }
};
