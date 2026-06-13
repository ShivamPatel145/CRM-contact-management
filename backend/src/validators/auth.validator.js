/**
 * @file auth.validator.js
 * @description Zod schemas for auth request validation.
 *
 * These schemas are used in the validateRequest middleware.
 * They define strict input contracts for each auth endpoint.
 */

const { z } = require("zod");

// ── Register ──────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name cannot exceed 60 characters"),

    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email address")
      .toLowerCase()
      .trim(),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password cannot exceed 72 characters") // bcrypt max
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

// ── Login ─────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email address")
      .toLowerCase()
      .trim(),

    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  }),
});

module.exports = { registerSchema, loginSchema };
