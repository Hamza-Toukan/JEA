const jwt = require("jsonwebtoken");

const { env } = require("../../core/config/env");
const { User } = require("../users/user.model");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required",
        requestId: req.requestId
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    let payload;

    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
        requestId: req.requestId
      });
    }

    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required",
        requestId: req.requestId
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

function requireRole(allowedRoles = []) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required",
        requestId: req.requestId
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource",
        requestId: req.requestId
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};