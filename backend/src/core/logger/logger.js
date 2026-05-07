const pino = require("pino");
const { env } = require("../config/env");

const isDevelopment = env.NODE_ENV === "development";

const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "jea-digital-assistant-api"
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname"
        }
      }
    : undefined
});

module.exports = {
  logger
};