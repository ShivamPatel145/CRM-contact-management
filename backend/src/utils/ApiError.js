/**
 * @file ApiError.js
 * @description Custom error class for operational API errors.
 *
 * Distinguishes between programmer errors (unexpected) and
 * operational errors (expected, e.g. "not found", "unauthorized").
 * The global error handler inspects `isOperational` to decide
 * how to respond.
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode  - HTTP status code to send to client
   * @param {string} message     - Human-readable error message
   * @param {Array}  errors      - Optional validation error details
   */
  constructor(statusCode, message, errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Distinguishes from unhandled programmer errors

    // Capture stack trace (V8 specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
