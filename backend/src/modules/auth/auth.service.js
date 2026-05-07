const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { env } = require("../../core/config/env");
const { User } = require("../users/user.model");

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    }
  );
}

async function loginWithEmailAndPassword({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  if (user.status !== "active") {
    const error = new Error("User account is inactive");
    error.statusCode = 403;
    error.code = "USER_INACTIVE";
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signAuthToken(user);

  return {
    token,
    user: sanitizeUser(user)
  };
}

module.exports = {
  sanitizeUser,
  signAuthToken,
  loginWithEmailAndPassword
};