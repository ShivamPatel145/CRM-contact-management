/**
 * @file errorHandler.js
 * @description Centralized global error handling middleware.
 *
 * Must be registered LAST in Express middleware chain.
 * Handles: ApiError instances, Mongoose errors, JWT errors,
 * Zod validation errors, and unexpected errors.
 */

const ApiError = require("../utils/ApiError");
const env = require("../config/env");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // ── Mongoose: Document not found ──────────────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: Duplicate key ───────────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // ── Mongoose: Validation error ────────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  // ── Zod validation errors ─────────────────────────────────────────────────
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // ── Stack trace in development only ───────────────────────────────────────
  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
