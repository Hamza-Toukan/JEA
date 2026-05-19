const { env } = require("../core/config/env");
const { logger } = require("../core/logger/logger");
const {
  retryFailedOutboundMessages,
} = require("../modules/conversations/outbound-delivery.service");

/** @type {NodeJS.Timeout | null} */
let intervalHandle = null;

function startOutboundRetryWorker() {
  if (env.ENABLE_OUTBOUND_RETRY_WORKER !== "true") {
    logger.info("Outbound retry worker is disabled");
    return;
  }

  if (intervalHandle) {
    return;
  }

  const intervalMs = env.OUTBOUND_RETRY_INTERVAL_MS;

  logger.info(
    {
      intervalMs,
      maxAttempts: env.OUTBOUND_DELIVERY_MAX_ATTEMPTS,
      batchSize: env.OUTBOUND_RETRY_BATCH_SIZE,
    },
    "Outbound retry worker started"
  );

  const runPass = async () => {
    try {
      await retryFailedOutboundMessages();
    } catch (error) {
      logger.error(
        { errorMessage: error.message },
        "Outbound retry worker pass failed"
      );
    }
  };

  intervalHandle = setInterval(runPass, intervalMs);

  if (typeof intervalHandle.unref === "function") {
    intervalHandle.unref();
  }

  runPass();
}

function stopOutboundRetryWorker() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    logger.info("Outbound retry worker stopped");
  }
}

module.exports = {
  startOutboundRetryWorker,
  stopOutboundRetryWorker,
};
