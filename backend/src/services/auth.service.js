/**
 * @file auth.service.js
 * @description Auth business logic — separated from HTTP concerns.
 *
 * Services contain the "what to do" (business rules).
 * Controllers contain the "how to respond" (HTTP layer).
 * This separation makes the logic independently testable.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

/**
 * Generate a signed JWT for a given user ID.
 * @param {string} userId - MongoDB ObjectId as string
 * @returns {string} Signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user.
 * @param {object} data - { name, email, password }
 * @returns {{ token: string, user: object }}
 * @throws {ApiError} 409 if email already exists
 */
const registerUser = async ({ name, email, password }) => {
  // Check for existing user (Mongoose unique index also enforces this,
  // but an explicit check gives a cleaner error message)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Create user — password is hashed by the pre-save hook in User.js
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id.toString());

  return { token, user: user.toPublicJSON() };
};

/**
 * Authenticate a user with email and password.
 * @param {object} data - { email, password }
 * @returns {{ token: string, user: object }}
 * @throws {ApiError} 401 if credentials are invalid
 */
const loginUser = async ({ email, password }) => {
  // Explicitly select password (excluded by default in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // Use a generic message to prevent user enumeration attacks
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user._id.toString());

  return { token, user: user.toPublicJSON() };
};

/**
 * Get the currently authenticated user's profile.
 * @param {string} userId - From req.user._id (set by protect middleware)
 * @returns {object} Public user profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  return user.toPublicJSON();
};

module.exports = { registerUser, loginUser, getMe };
