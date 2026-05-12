const express = require("express");
const rateLimit = require("express-rate-limit");

const { login } = require("./auth.controller");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      code: "TOO_MANY_LOGIN_ATTEMPTS",
      message: "Too many login attempts. Please try again later.",
      requestId: req.requestId,
    });
  },
});

router.post("/login", loginLimiter, login);

module.exports = router;
