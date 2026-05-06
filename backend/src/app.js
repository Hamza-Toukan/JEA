const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { env } = require("./core/config/env");
const { notFoundMiddleware } = require("./core/middleware/notFound.middleware");
const { errorMiddleware } = require("./core/middleware/error.middleware");

const healthRoutes = require("./modules/health/health.routes");
const mockWhatsappRoutes = require("./modules/channels/whatsapp/mock/mock-whatsapp.routes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use("/api/health", healthRoutes);
app.use("/api/dev/mock-whatsapp", mockWhatsappRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;