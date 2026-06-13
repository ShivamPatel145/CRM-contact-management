/**
 * @file app.js
 * @description Express application factory.
 *
 * Responsibilities:
 * - Apply security middleware (Helmet, CORS, rate limiting)
 * - Apply logging and request parsing
 * - Mount API route modules
 * - Apply 404 and global error handlers
 *
 * Separation from server.js allows testing the app
 * without starting an HTTP server.
 */

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const env = require("./config/env");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────

// Set secure HTTP headers
app.use(helmet());

// CORS: allow only configured client origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Global rate limiter: max 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

app.use(globalLimiter);

// ── Logging ───────────────────────────────────────────────────────────────────
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Reject payloads > 10kb
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── API Routes ────────────────────────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  res.json({ success: true, message: "CRM API is running", version: "1.0.0" });
});

const authRoutes = require("./routes/auth.routes");
const contactRoutes = require("./routes/contact.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

apiRouter.use("/auth", authLimiter, authRoutes);
apiRouter.use("/contacts", contactRoutes);
apiRouter.use("/dashboard", dashboardRoutes);

// Mount router on both /api (local dev) and / (Vercel)
app.use(["/api", "/"], apiRouter);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
