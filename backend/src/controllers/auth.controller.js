/**
 * @file auth.controller.js
 * @description Auth HTTP controllers — thin layer over auth service.
 *
 * Controllers are responsible for:
 * 1. Reading from req (body, params, user)
 * 2. Calling the appropriate service function
 * 3. Sending the standardized response
 *
 * All business logic lives in auth.service.js.
 * Error handling is done by asyncHandler + global error handler.
 */

const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * POST /api/auth/register
 * Register a new user account.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { token, user } = await authService.registerUser({
    name,
    email,
    password,
  });

  ApiResponse.send(res, 201, "Account created successfully.", { token, user });
});

/**
 * POST /api/auth/login
 * Authenticate and receive a JWT.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await authService.loginUser({ email, password });

  ApiResponse.send(res, 200, "Login successful.", { token, user });
});

/**
 * GET /api/auth/me
 * Get the current authenticated user's profile.
 * Requires: protect middleware
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await authService.getMe(req.user._id);

  ApiResponse.send(res, 200, "User profile retrieved.", { user });
});

module.exports = { register, login, getMe };
