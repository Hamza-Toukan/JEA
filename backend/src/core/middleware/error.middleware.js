const { logger } = require("../logger/logger");

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";

  logger.error(
    {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      code,
      errorMessage: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    },
    "Request failed"
  );

  res.status(statusCode).json({
    success: false,
    code,
    message: error.message || "Internal server error",
    requestId: req.requestId
  });
}

module.exports = {
  errorMiddleware
};