const express = require("express");
const { pingRedis, isRedisConfigured } = require("../../core/queue/redis.connection");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  const mongoHealthy = mongoose.connection.readyState === 1;
  let redisHealthy = null;

  if (isRedisConfigured()) {
    try {
      redisHealthy = await pingRedis();
    } catch {
      redisHealthy = false;
    }
  }

  const healthy =
    mongoHealthy && (redisHealthy === null || redisHealthy === true);

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    service: "JEA Digital Assistant API",
    status: healthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks: {
      mongo: mongoHealthy,
      redis: redisHealthy,
    },
    requestId: req.requestId,
  });
});

module.exports = router;
