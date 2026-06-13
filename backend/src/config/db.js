/**
 * @file db.js
 * @description MongoDB connection using Mongoose.
 * Handles connection events, retries gracefully.
 */

const mongoose = require("mongoose");
const env = require("./env");

/**
 * Connect to MongoDB Atlas.
 * Exits process on unrecoverable connection failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    console.error("❌  MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
