const express = require("express");
const { env } = require("../../../../core/config/env");
const { logger } = require("../../../../core/logger/logger");
const { receiveMockIncomingMessage } = require("./mock-whatsapp.controller");

const router = express.Router();

function mockDisabledResponse(req, res) {
  return res.status(403).json({
    success: false,
    code: "MOCK_DISABLED",
    message: "Mock WhatsApp endpoint is disabled",
    requestId: req.requestId,
  });
}

router.use((req, res, next) => {
  if (env.NODE_ENV !== "development" && env.ENABLE_MOCK_WHATSAPP !== "true") {
    return mockDisabledResponse(req, res);
  }

  next();
});

router.use((req, res, next) => {
  const isDevelopment = env.NODE_ENV === "development";
  const hasSecret =
    typeof env.MOCK_WHATSAPP_SECRET === "string" &&
    env.MOCK_WHATSAPP_SECRET.length > 0;

  if (!isDevelopment && !hasSecret) {
    logger.error(
      { nodeEnv: env.NODE_ENV },
      "Mock WhatsApp is enabled without MOCK_WHATSAPP_SECRET in a non-development environment"
    );
    return res.status(503).json({
      success: false,
      code: "MOCK_MISCONFIGURED",
      message:
        "Mock WhatsApp requires MOCK_WHATSAPP_SECRET when NODE_ENV is not development",
      requestId: req.requestId,
    });
  }

  const headerSecret = req.headers["x-mock-whatsapp-secret"];

  if (!isDevelopment) {
    if (headerSecret !== env.MOCK_WHATSAPP_SECRET) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Invalid or missing mock WhatsApp secret",
        requestId: req.requestId,
      });
    }
    return next();
  }

  if (hasSecret && headerSecret !== env.MOCK_WHATSAPP_SECRET) {
    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Invalid mock secret",
      requestId: req.requestId,
    });
  }

  next();
});

router.post("/incoming", receiveMockIncomingMessage);

module.exports = router;
