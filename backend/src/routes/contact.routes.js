/**
 * @file contact.routes.js
 * @description Contact CRUD routes — implemented in Milestone 3.
 * Placeholder to prevent require() error during Milestone 1 setup.
 */

const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ success: true, message: "Contact routes active" });
});

module.exports = router;
