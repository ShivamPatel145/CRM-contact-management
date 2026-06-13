/**
 * @file asyncHandler.js
 * @description Wraps async Express route handlers to catch errors.
 *
 * Without this wrapper, thrown errors inside async functions
 * are unhandled rejections. This ensures they're forwarded to
 * Express's next(error) and handled by the global error handler.
 *
 * Usage:
 *   router.post('/register', asyncHandler(async (req, res) => { ... }))
 *
 * @param {Function} fn - Async express handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
