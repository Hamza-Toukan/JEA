const { env } = require("../config/env");
const { logger } = require("../logger/logger");
const {
  QUEUE_NAMES,
  JOB_NAMES,
} = require("./queue.constants");
const {
  buildProviderMessageJobId,
  getOrCreateQueue,
} = require("./queue.factory");
const { isRedisConfigured } = require("./redis.connection");

/**
 * @typedef {Object} InboundMessageJobPayload
 * @property {string} from
 * @property {string} text
 * @property {string} provider
 * @property {string} providerMessageId
 * @property {Record<string, unknown>} [metadata]
 * @property {string} [requestId]
 */

function isAsyncInboundProcessingEnabled() {
  return (
    env.ENABLE_ASYNC_INBOUND_PROCESSING === "true" && isRedisConfigured()
  );
}

function getInboundMessageQueue() {
  return getOrCreateQueue(QUEUE_NAMES.INBOUND_MESSAGE_PROCESSING);
}

/**
 * @param {InboundMessageJobPayload} payload
 * @returns {Promise<import('bullmq').Job>}
 */
async function enqueueInboundMessageJob(payload) {
  if (!payload.providerMessageId) {
    throw new Error("enqueueInboundMessageJob requires providerMessageId");
  }

  const queue = getInboundMessageQueue();
  const jobId = buildProviderMessageJobId(
    payload.provider,
    payload.providerMessageId
  );

  const enqueuedAt = Date.now();

  const job = await queue.add(JOB_NAMES.PROCESS_INBOUND, payload, {
    jobId,
  });

  logger.info(
    {
      queueName: QUEUE_NAMES.INBOUND_MESSAGE_PROCESSING,
      jobName: JOB_NAMES.PROCESS_INBOUND,
      jobId: job.id,
      bullJobId: jobId,
      provider: payload.provider,
      providerMessageId: payload.providerMessageId,
      customerPhone: payload.from,
      requestId: payload.requestId || null,
      queueLatencyMs: job.timestamp ? enqueuedAt - job.timestamp : 0,
    },
    "Inbound message job enqueued"
  );

  return job;
}

module.exports = {
  isAsyncInboundProcessingEnabled,
  getInboundMessageQueue,
  enqueueInboundMessageJob,
};
