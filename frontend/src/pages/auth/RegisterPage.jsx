/**
 * @file RegisterPage.jsx
 * @description User registration page with React Hook Form + Zod validation.
 *
 * Features:
 * - Full name, email, password, confirm password fields
 * - Client-side Zod validation matching backend rules
 * - Password strength indicator
 * - Show/hide password toggle
 * - Loading state during registration
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Layers, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRegister } from "../../hooks/useAuthActions";

// ── Zod schema (mirrors backend with confirmPassword addition) ─────────────────
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name cannot exceed 60 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Password strength helper ──────────────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
  if (score === 3) return { score, label: "Fair", color: "#f59e0b" };
  if (score === 4) return { score, label: "Good", color: "#3b82f6" };
  return { score, label: "Strong", color: "#16a34a" };
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { handleRegister, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = (data) => {
    // Strip confirmPassword before sending to API
    const { confirmPassword, ...payload } = data;
    handleRegister(payload);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "440px" }}>
        {/* ── Logo & Heading ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
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
              margin: "0 0 0.375rem",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Start managing your contacts for free
          </p>
        </div>

        {/* ── Form ───────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">
              Full name <span className="required">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              autoFocus
              placeholder="John Smith"
              className={`form-input${errors.name ? " error" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <p className="form-error">
                <AlertCircle size={13} />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email address <span className="required">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
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
            <label htmlFor="reg-password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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

            {/* Password strength bar */}
            {passwordValue && (
              <div style={{ marginTop: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "9999px",
                        background:
                          i <= strength.score ? strength.color : "#e2e8f0",
                        transition: "background 0.2s",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "0.75rem", color: strength.color, fontWeight: 500 }}>
                  {strength.label}
                </span>
              </div>
            )}

            {errors.password && (
              <p className="form-error">
                <AlertCircle size={13} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm password <span className="required">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="reg-confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`form-input${errors.confirmPassword ? " error" : ""}`}
                style={{ paddingRight: "2.75rem" }}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
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
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="form-error">
                <AlertCircle size={13} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password requirements hint */}
          <div
            style={{
              background: "var(--color-primary-light)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 0.875rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {[
              { rule: /^.{8,}$/, text: "At least 8 characters" },
              { rule: /[A-Z]/, text: "One uppercase letter" },
              { rule: /[a-z]/, text: "One lowercase letter" },
              { rule: /\d/, text: "One number" },
            ].map(({ rule, text }) => {
              const met = rule.test(passwordValue);
              return (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.8rem",
                    color: met ? "var(--color-success)" : "var(--color-text-muted)",
                    transition: "color 0.2s",
                  }}
                >
                  <CheckCircle2 size={13} />
                  {text}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Creating account...
              </>
            ) : (
              "Create account"
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--color-primary)",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
