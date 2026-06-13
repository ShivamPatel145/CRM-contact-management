/**
 * @file ProtectedRoute.jsx
 * @description Route guard for authenticated pages.
 *
 * Renders children only if the user has a valid JWT.
 * Shows a full-page spinner during the initial auth check
 * so there's no flash of redirect before localStorage is read.
 * Redirects to /login with the original location saved in state
 * so the user is returned after login.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--color-bg)",
        }}
      >
        <div className="spinner" style={{ width: "2rem", height: "2rem", color: "var(--color-primary)" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
