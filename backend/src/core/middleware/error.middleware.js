function errorMiddleware(error, req, res, next) {
  console.error("❌ Error:", error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    code: error.code || "INTERNAL_SERVER_ERROR",
    message: error.message || "Internal server error"
  });
}

module.exports = {
  errorMiddleware
};