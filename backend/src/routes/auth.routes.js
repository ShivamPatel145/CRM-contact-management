/**
 * @file auth.routes.js
 * @description Authentication routes — implemented in Milestone 2.
 * Placeholder to prevent require() error during Milestone 1 setup.
 */

const express = require("express");
const router = express.Router();

// Placeholder — will be replaced in Milestone 2
router.get("/ping", (req, res) => {
  res.json({ success: true, message: "Auth routes active" });
});

module.exports = router;
