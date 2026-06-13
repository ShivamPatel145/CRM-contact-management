/**
 * @file db.js
 * @description MongoDB connection using Mongoose.
 * Handles connection events, retries gracefully.
 */

const mongoose = require("mongoose");
const env = require("./env");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI).then((mongoose) => {
      console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch(error => {
      console.error("❌  MongoDB connection failed:", error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
