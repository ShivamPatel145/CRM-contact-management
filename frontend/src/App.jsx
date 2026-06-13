import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import queryClient from "./lib/queryClient";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";

// ── Lazy-loaded Pages ─────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const ContactsListPage = lazy(() => import("./pages/contacts/ContactsListPage"));

// ── Lazy suspense fallback ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 text-center">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px] mx-auto" />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" defaultPalette="cobalt">
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

                {/* ── 404 catch-all ──────────────────────────────────────── */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>

            {/* Global toast notification system */}
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
