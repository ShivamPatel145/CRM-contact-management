/**
 * @file env.js
 * @description Centralized, validated environment configuration.
 * Fail-fast: the app will not start if required vars are missing.
 */

const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .default("5000")
    .transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error("❌  Invalid environment variables:\n");
  console.error(_parsed.error.format());
  process.exit(1);
}

module.exports = _parsed.data;
