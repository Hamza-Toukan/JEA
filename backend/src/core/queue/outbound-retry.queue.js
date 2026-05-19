const { env } = require("../config/env");
const { logger } = require("../logger/logger");
const {
  QUEUE_NAMES,
  JOB_NAMES,
  OUTBOUND_RETRY_REPEATABLE_JOB_ID,
} = require("./queue.constants");
const { getOrCreateQueue } = require("./queue.factory");
const { isRedisConfigured } = require("./redis.connection");

function isOutboundRetryQueueEnabled() {
  return env.ENABLE_OUTBOUND_RETRY_QUEUE === "true" && isRedisConfigured();
}

function getOutboundRetryQueue() {
  return getOrCreateQueue(QUEUE_NAMES.OUTBOUND_RETRY);
}

/**
 * Registers a repeatable reconciliation job (idempotent job id).
 */
async function registerOutboundRetryScheduler() {
  const queue = getOutboundRetryQueue();

  const repeatables = await queue.getRepeatableJobs();
  const alreadyRegistered = repeatables.some(
    (entry) =>
      entry.name === JOB_NAMES.RECONCILE_FAILED_OUTBOUND ||
      entry.id === OUTBOUND_RETRY_REPEATABLE_JOB_ID
  );

  if (alreadyRegistered) {
    logger.info(
      { queueName: QUEUE_NAMES.OUTBOUND_RETRY },
      "Outbound retry repeatable job already registered"
    );
    return;
  }

  await queue.add(
    JOB_NAMES.RECONCILE_FAILED_OUTBOUND,
    {},
    {
      jobId: OUTBOUND_RETRY_REPEATABLE_JOB_ID,
      repeat: {
        every: env.OUTBOUND_RETRY_INTERVAL_MS,
      },
    }
  );

  logger.info(
    {
      queueName: QUEUE_NAMES.OUTBOUND_RETRY,
      jobName: JOB_NAMES.RECONCILE_FAILED_OUTBOUND,
      intervalMs: env.OUTBOUND_RETRY_INTERVAL_MS,
    },
    "Outbound retry repeatable job registered"
  );
}

module.exports = {
  isOutboundRetryQueueEnabled,
  getOutboundRetryQueue,
  registerOutboundRetryScheduler,
};
