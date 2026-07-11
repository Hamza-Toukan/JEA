const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { env } = require("./core/config/env");
const { notFoundMiddleware } = require("./core/middleware/notFound.middleware");
const { errorMiddleware } = require("./core/middleware/error.middleware");
const {
  requestIdMiddleware,
} = require("./core/middleware/requestId.middleware");
const { logger } = require("./core/logger/logger");

const healthRoutes = require("./modules/health/health.routes");
const mockWhatsappRoutes = require("./modules/channels/whatsapp/mock/mock-whatsapp.routes");
const twilioWhatsappRoutes = require("./modules/channels/whatsapp/twilio/twilio.routes");
const conversationRoutes = require("./modules/conversations/conversation.routes");
const authRoutes = require("./modules/auth/auth.routes");

const app = express();

app.use(requestIdMiddleware);

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

const {
  validateTwilioSignatureMiddleware,
} = require("./modules/channels/whatsapp/twilio/middleware/twilio-signature.middleware");

app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message) => {
        logger.info({ type: "http_request" }, message.trim());
      },
    },
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dev/mock-whatsapp", mockWhatsappRoutes);

// Twilio webhooks: urlencoded (extended:false) required for signature validation
app.use(
  "/api/whatsapp/twilio",
  express.urlencoded({ extended: false }),
  twilioWhatsappRoutes
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/conversations", conversationRoutes);

if (env.ENABLE_MOCK_WHATSAPP === "true") {
  const hasMockSecret =
    typeof env.MOCK_WHATSAPP_SECRET === "string" &&
    env.MOCK_WHATSAPP_SECRET.length > 0;

  if (!hasMockSecret && env.NODE_ENV === "development") {
    logger.warn(
      { nodeEnv: env.NODE_ENV },
      "Mock WhatsApp is enabled without MOCK_WHATSAPP_SECRET — acceptable for local development only"
    );
  }

  if (!hasMockSecret && env.NODE_ENV !== "development") {
    logger.error(
      { nodeEnv: env.NODE_ENV },
      "Mock WhatsApp is enabled without MOCK_WHATSAPP_SECRET in a non-development environment — incoming requests will be rejected"
    );
  }
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
