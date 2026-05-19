const {
  retryFailedOutboundMessages,
} = require("../../modules/conversations/outbound-delivery.service");
const { logger } = require("../../core/logger/logger");

/**
 * @param {import('bullmq').Job} job
 */
async function processOutboundRetryJob(job) {
  const startedAt = Date.now();

  const result = await retryFailedOutboundMessages({
    limit: job.data?.limit,
  });

  logger.info(
    {
      jobId: job.id,
      jobName: job.name,
      durationMs: Date.now() - startedAt,
      ...result,
    },
    "Outbound retry reconciliation job processed"
  );

  return result;
}

module.exports = {
  processOutboundRetryJob,
};
