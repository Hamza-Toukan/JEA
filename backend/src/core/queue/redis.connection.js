const Redis = require("ioredis");
const { env } = require("../config/env");
const { logger } = require("../logger/logger");

/** @type {import('ioredis').Redis | null} */
let redisConnection = null;

/**
 * BullMQ requires maxRetriesPerRequest: null on ioredis clients.
 * @returns {import('ioredis').Redis}
 */
function getRedisConnection() {
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  if (!redisConnection) {
    redisConnection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });

    redisConnection.on("error", (error) => {
      logger.error(
        { errorMessage: error.message },
        "Redis connection error"
      );
    });

    redisConnection.on("connect", () => {
      logger.info("Redis connected");
    });
  }

  return redisConnection;
}

function isRedisConfigured() {
  return Boolean(env.REDIS_URL && String(env.REDIS_URL).trim());
}

async function pingRedis() {
  if (!isRedisConfigured()) {
    return false;
  }

  const connection = getRedisConnection();
  const result = await connection.ping();
  return result === "PONG";
}

async function closeRedisConnection() {
  if (!redisConnection) {
    return;
  }

  await redisConnection.quit();
  redisConnection = null;
  logger.info("Redis connection closed");
}

module.exports = {
  getRedisConnection,
  isRedisConfigured,
  pingRedis,
  closeRedisConnection,
};
