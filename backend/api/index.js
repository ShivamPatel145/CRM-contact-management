const app = require("../src/app");
const connectDB = require("../src/config/db");

// Connect to MongoDB. Mongoose will buffer requests until the connection is established.
// This is perfectly suited for Vercel Serverless Functions.
connectDB();

// Export the Express app so Vercel can handle the incoming requests serverlessly.
module.exports = app;
