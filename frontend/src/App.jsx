/**
 * @file App.jsx
 * @description Root application component.
 *
 * Defines the full client-side routing tree.
 * All pages are lazy-loaded for optimal bundle splitting.
 * Protected routes are wrapped in <ProtectedRoute>.
 * Public-only routes (login/register) are wrapped in <PublicRoute>.
 */

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import queryClient from "./lib/queryClient";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

// ── Lazy-loaded Pages ─────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const ContactsListPage = lazy(() => import("./pages/contacts/ContactsListPage"));
const ContactDetailPage = lazy(() => import("./pages/contacts/ContactDetailPage"));
const ContactFormPage = lazy(() => import("./pages/contacts/ContactFormPage"));

// ── Lazy suspense fallback ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "var(--color-bg)",
    }}
  >
    <div
      className="spinner"
      style={{ width: "2rem", height: "2rem", color: "var(--color-primary)" }}
    />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Root redirect ──────────────────────────────────────── */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* ── Public routes (auth pages) ─────────────────────────── */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* ── Protected routes (require JWT) ─────────────────────── */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <ContactsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts/new"
                element={
                  <ProtectedRoute>
                    <ContactFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts/:id"
                element={
                  <ProtectedRoute>
                    <ContactDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts/:id/edit"
                element={
                  <ProtectedRoute>
                    <ContactFormPage />
                  </ProtectedRoute>
                }
              />

              {/* ── 404 catch-all ──────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>

          {/* Global toast notification system */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
            toastOptions={{
              style: {
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
