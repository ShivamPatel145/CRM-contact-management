/**
 * @file useAuthActions.js
 * @description Custom hook for auth mutations (login, register).
 *
 * Combines React Hook Form + Zod + auth service + context in one place.
 * Components only need to call these hooks — no wiring required.
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { loginApi, registerApi } from "../services/auth.service";

/**
 * Extracts the best user-facing error message from an Axios error.
 * Handles API validation errors, server errors, and network errors.
 */
const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  // Field-level validation errors from backend Zod
  if (data?.errors?.length > 0) {
    return data.errors.map((e) => e.message).join(". ");
  }

  // Single message from API
  if (data?.message) return data.message;

  // Network error
  if (error?.code === "ECONNREFUSED" || error?.message === "Network Error") {
    return "Cannot connect to server. Please check your connection.";
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Hook for login form handling.
 */
export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to where they came from, or dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const { token, user } = await loginApi(formData);
      login(token, user);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};

/**
 * Hook for register form handling.
 */
export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      const { token, user } = await registerApi(formData);
      login(token, user);
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};
