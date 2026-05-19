const mongoose = require("mongoose");
const { env } = require("../config/env");
const { logger } = require("../logger/logger");

async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(
      {
        errorMessage: error.message
      },
      "MongoDB connection failed"
    );

    process.exit(1);
  }
}

async function disconnectDB() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

module.exports = {
  connectDB,
  disconnectDB,
};