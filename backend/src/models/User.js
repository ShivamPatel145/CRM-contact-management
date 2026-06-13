/**
 * @file User.js
 * @description Mongoose User model.
 *
 * Password is hashed with bcrypt before every save (pre-save hook).
 * comparePassword() is an instance method used in the login flow.
 * The password field is excluded from queries by default via `select: false`.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12; // bcrypt cost factor — 12 is a good production balance

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never returned in queries unless explicitly requested
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ── Pre-save Hook: Hash password ──────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash when password is new or modified
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error);
  }
});

// ── Instance Method: Verify password ─────────────────────────────────────────
/**
 * Compare a plain-text candidate password with the stored hash.
 * @param {string} candidatePassword - The password from the login request
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance Method: Safe public profile ─────────────────────────────────────
/**
 * Returns user object without sensitive fields.
 * Used when sending user data to the client.
 */
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
