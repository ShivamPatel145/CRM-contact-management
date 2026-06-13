/**
 * @file server.js
 * @description HTTP server entry point.
 *
 * Connects to MongoDB, then starts the Express HTTP server.
 * Handles unhandled promise rejections and uncaught exceptions
 * for a graceful crash process.
 */

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

// ── Process-level error guards ────────────────────────────────────────────────

// Handles asynchronous unhandled rejections (e.g. bad DB query)
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION! Shutting down...", reason);
  process.exit(1);
});

// Handles synchronous uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...", error);
  process.exit(1);
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀  Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    console.log(`📡  API base: http://localhost:${env.PORT}/api`);
  });

  // Graceful shutdown on SIGTERM (e.g. from Docker / process manager)
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing HTTP server gracefully...");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });
};

start();
