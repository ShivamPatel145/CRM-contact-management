const express = require("express");
const { getDashboardStats } = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All dashboard routes are protected
router.use(protect);

router.get("/stats", getDashboardStats);

module.exports = router;
