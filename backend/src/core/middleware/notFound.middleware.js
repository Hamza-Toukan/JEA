function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    code: "ROUTE_NOT_FOUND",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    requestId: req.requestId,
  });
}

module.exports = {
  notFoundMiddleware,
};
