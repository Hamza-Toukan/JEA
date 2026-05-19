const {
  processIncomingMessage,
} = require("../../modules/orchestrators/conversation-orchestrator.service");
const { logger } = require("../../core/logger/logger");

/**
 * BullMQ processor — reuses existing orchestrator pipeline unchanged.
 *
 * @param {import('bullmq').Job} job
 */
async function processInboundMessageJob(job) {
  const startedAt = Date.now();
  const payload = job.data || {};

  logger.info(
    {
      jobId: job.id,
      jobName: job.name,
      provider: payload.provider,
      providerMessageId: payload.providerMessageId,
      customerPhone: payload.from,
      requestId: payload.requestId || null,
      attemptsMade: job.attemptsMade,
    },
    "Processing inbound message job"
  );

  const result = await processIncomingMessage({
    from: payload.from,
    text: payload.text,
    provider: payload.provider,
    providerMessageId: payload.providerMessageId,
    metadata: payload.metadata || {},
  });

  logger.info(
    {
      jobId: job.id,
      providerMessageId: payload.providerMessageId,
      conversationId: result.conversation?._id
        ? String(result.conversation._id)
        : null,
      outboundMessageId: result.outboundMessage?._id
        ? String(result.outboundMessage._id)
        : null,
      durationMs: Date.now() - startedAt,
    },
    "Inbound message job processed"
  );

  return {
    conversationId: result.conversation?._id
      ? String(result.conversation._id)
      : null,
    outboundMessageId: result.outboundMessage?._id
      ? String(result.outboundMessage._id)
      : null,
  };
}

module.exports = {
  processInboundMessageJob,
};
