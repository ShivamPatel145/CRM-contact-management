const app = require("../src/app");
const connectDB = require("../src/config/db");

// Export an async request handler so Vercel can await the DB connection
module.exports = async (req, res) => {
  try {
    await connectDB();
    // Pass the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ success: false, message: "Database connection failed", error: error.message });
  }
};
