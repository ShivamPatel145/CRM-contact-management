/**
 * @file PublicRoute.jsx
 * @description Route guard for public-only pages (login, register).
 *
 * Redirects authenticated users away from auth pages
 * to the dashboard (or the original requested page if any).
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Brief blank screen during rehydration — intentionally minimal
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
