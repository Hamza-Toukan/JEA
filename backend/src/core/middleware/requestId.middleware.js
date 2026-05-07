const crypto = require("crypto");

function requestIdMiddleware(req, res, next) {
  const incomingRequestId = req.headers["x-request-id"];

  req.requestId =
    typeof incomingRequestId === "string" && incomingRequestId.trim()
      ? incomingRequestId.trim()
      : crypto.randomUUID();

  res.setHeader("X-Request-Id", req.requestId);

  next();
}

module.exports = {
  requestIdMiddleware
};