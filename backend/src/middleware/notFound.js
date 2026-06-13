/**
 * @file notFound.js
 * @description 404 handler for unmatched routes.
 * Register this BEFORE the global error handler.
 */

const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
