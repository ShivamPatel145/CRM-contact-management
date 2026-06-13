/**
 * @file dashboard.routes.js
 * @description Dashboard analytics routes — implemented in Milestone 6.
 * Placeholder to prevent require() error during Milestone 1 setup.
 */

const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ success: true, message: "Dashboard routes active" });
});

module.exports = router;
