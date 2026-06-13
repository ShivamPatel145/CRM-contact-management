/**
 * @file auth.middleware.js
 * @description JWT authentication middleware.
 *
 * Extracts the Bearer token from the Authorization header,
 * verifies it, fetches the user from DB, and attaches the
 * user to req.user for downstream handlers.
 *
 * Usage:
 *   router.get('/me', protect, authController.getMe)
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

/**
 * Protect middleware — requires valid JWT.
 * Attaches authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    // ── 1. Extract token ─────────────────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new ApiError(401, "Authentication required. Please log in.")
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Authentication token is missing."));
    }

    // ── 2. Verify token ──────────────────────────────────────────────────────
    // jwt.verify throws JsonWebTokenError or TokenExpiredError on failure
    // These are handled by the global error handler
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // ── 3. Fetch user from DB ────────────────────────────────────────────────
    // We verify the user still exists (e.g. account not deleted since token was issued)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(
        new ApiError(401, "The user associated with this token no longer exists.")
      );
    }

    // ── 4. Attach user to request ────────────────────────────────────────────
    req.user = user;
    next();
  } catch (error) {
    // Let the global error handler format JWT-specific errors
    next(error);
  }
};

module.exports = { protect };
