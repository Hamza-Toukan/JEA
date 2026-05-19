const { env } = require("../core/config/env");
const { logger } = require("../core/logger/logger");
const { connectDB, disconnectDB } = require("../core/database/db");
const {
  closeRedisConnection,
  isRedisConfigured,
} = require("../core/queue/redis.connection");
const {
  QUEUE_NAMES,
} = require("../core/queue/queue.constants");
const {
  createWorker,
  closeAllWorkers,
  closeAllQueues,
} = require("../core/queue/queue.factory");
const {
  isOutboundRetryQueueEnabled,
  registerOutboundRetryScheduler,
} = require("../core/queue/outbound-retry.queue");
const {
  isAsyncInboundProcessingEnabled,
} = require("../core/queue/inbound-message.queue");
const {
  processInboundMessageJob,
} = require("./processors/inbound-message.processor");
const {
  processOutboundRetryJob,
} = require("./processors/outbound-retry.processor");

/** @type {boolean} */
let isShuttingDown = false;

/** @type {import('bullmq').Worker[]} */
let activeWorkers = [];

async function startWorkers() {
  if (!isRedisConfigured()) {
    throw new Error(
      "Worker process requires REDIS_URL when queue processing is enabled"
    );
  }

  await connectDB();

  if (isAsyncInboundProcessingEnabled()) {
    const inboundWorker = createWorker(
      QUEUE_NAMES.INBOUND_MESSAGE_PROCESSING,
      processInboundMessageJob,
      { concurrency: env.INBOUND_QUEUE_CONCURRENCY }
    );
    activeWorkers.push(inboundWorker);
  } else {
    logger.warn(
      "Inbound message queue worker not started (async inbound disabled or Redis missing)"
    );
  }

  if (isOutboundRetryQueueEnabled()) {
    await registerOutboundRetryScheduler();

    const outboundRetryWorker = createWorker(
      QUEUE_NAMES.OUTBOUND_RETRY,
      processOutboundRetryJob,
      { concurrency: 1 }
    );
    activeWorkers.push(outboundRetryWorker);
  } else {
    logger.warn(
      "Outbound retry queue worker not started (queue disabled or Redis missing)"
    );
  }

  if (activeWorkers.length === 0) {
    throw new Error("No queue workers were started — check environment configuration");
  }

  logger.info(
    {
      workerCount: activeWorkers.length,
      inboundQueue: isAsyncInboundProcessingEnabled(),
      outboundRetryQueue: isOutboundRetryQueueEnabled(),
    },
    "Queue workers started"
  );
}

async function shutdownWorkers() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info("Worker graceful shutdown started");

  await closeAllWorkers();
  activeWorkers = [];

  await closeAllQueues();
  await disconnectDB();
  await closeRedisConnection();

  logger.info("Worker graceful shutdown completed");
}

function registerGracefulShutdownHandlers() {
  const handleSignal = (signal) => {
    logger.info({ signal }, "Worker received shutdown signal");

    shutdownWorkers()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        logger.error(
          { errorMessage: error.message, signal },
          "Worker graceful shutdown failed"
        );
        process.exit(1);
      });
  };

  process.on("SIGTERM", () => handleSignal("SIGTERM"));
  process.on("SIGINT", () => handleSignal("SIGINT"));
}

module.exports = {
  startWorkers,
  shutdownWorkers,
  registerGracefulShutdownHandlers,
};
