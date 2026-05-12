const { env } = require("../config/env");
const { logger } = require("../logger/logger");

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";

  const isProduction = env.NODE_ENV === "production";

  const message =
    statusCode >= 500 && isProduction
      ? "Internal server error"
      : error.message || "Internal server error";

  logger.error(
    {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      code,
      errorMessage: error.message,
      stack: error.stack,
    },
    "Request failed"
  );

  res.status(statusCode).json({
    success: false,
    code,
    message,
    requestId: req.requestId,
  });
}

module.exports = {
  errorMiddleware,
};
