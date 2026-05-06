const mongoose = require("mongoose");
const { env } = require("../config/env");

async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = {
  connectDB
};