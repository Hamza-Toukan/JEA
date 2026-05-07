const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const { env } = require("../src/core/config/env");
const { connectDB } = require("../src/core/database/db");
const { logger } = require("../src/core/logger/logger");
const { User } = require("../src/modules/users/user.model");

async function seedAdmin() {
  await connectDB();

  if (!env.ADMIN_SEED_NAME || !env.ADMIN_SEED_EMAIL || !env.ADMIN_SEED_PASSWORD) {
    logger.error(
      "ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, and ADMIN_SEED_PASSWORD are required"
    );
    process.exit(1);
  }

  const email = env.ADMIN_SEED_EMAIL.toLowerCase().trim();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    logger.info(
      {
        email
      },
      "Admin user already exists"
    );

    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, 12);

  await User.create({
    name: env.ADMIN_SEED_NAME,
    email,
    passwordHash,
    role: "admin",
    status: "active"
  });

  logger.info(
    {
      email
    },
    "Admin user seeded successfully"
  );

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch(async (error) => {
  logger.error(
    {
      errorMessage: error.message,
      stack: error.stack
    },
    "Admin seed failed"
  );

  await mongoose.disconnect();
  process.exit(1);
});