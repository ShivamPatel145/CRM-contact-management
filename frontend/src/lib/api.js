import axios from "axios";

// Determine base URL: use Vite proxy in dev, or absolute URL in prod
// The Vite proxy allows us to avoid CORS issues entirely during local development
const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // AuthContext saves the token in "crm_token"
    const token = localStorage.getItem("crm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
