/**
 * @file LoginPage.jsx
 * @description Login page with React Hook Form + Zod validation.
 *
 * Features:
 * - Client-side validation mirroring backend Zod rules
 * - Show/hide password toggle
 * - Loading state during API call
 * - Link to register page
 * - Redirect to originally requested page after login
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Layers, AlertCircle } from "lucide-react";
import { useLogin } from "../../hooks/useAuthActions";

// ── Zod schema (mirrors backend) ──────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ── Logo & Heading ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3rem",
              height: "3rem",
              borderRadius: "0.875rem",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              marginBottom: "1rem",
            }}
          >
            <Layers size={22} color="white" />
          </div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              margin: "0 0 0.375rem",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Sign in to your CRM Hub account
          </p>
        </div>

        {/* ── Form ───────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        >
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email address <span className="required">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              className={`form-input${errors.email ? " error" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="form-error">
                <AlertCircle size={13} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label htmlFor="login-password" className="form-label">
                Password <span className="required">*</span>
              </label>
            </div>

            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`form-input${errors.password ? " error" : ""}`}
                style={{ paddingRight: "2.75rem" }}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="form-error">
                <AlertCircle size={13} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem" }}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--color-border)",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--color-primary)",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
