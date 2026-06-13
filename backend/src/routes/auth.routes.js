/**
 * @file auth.routes.js
 * @description Authentication route definitions.
 *
 * POST /api/auth/register  — Create new account
 * POST /api/auth/login     — Authenticate, receive JWT
 * GET  /api/auth/me        — Get current user (protected)
 */

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

// POST /api/auth/register
router.post("/register", validate(registerSchema), authController.register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), authController.login);

// GET /api/auth/me  (protected)
router.get("/me", protect, authController.getMe);

module.exports = router;
