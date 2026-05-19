const { Queue, Worker } = require("bullmq");
const { env } = require("../config/env");
const { logger } = require("../logger/logger");
const { getRedisConnection } = require("./redis.connection");
const { QUEUE_NAMES } = require("./queue.constants");

/** @type {Map<string, import('bullmq').Queue>} */
const queuesByName = new Map();

/** @type {import('bullmq').Worker[]} */
const registeredWorkers = [];

/**
 * @param {string} provider
 * @param {string} providerMessageId
 * @returns {string}
 */
function buildProviderMessageJobId(provider, providerMessageId) {
  return `${provider}-${providerMessageId}`;
}

function getQueueDefaultJobOptions(queueName) {
  if (queueName === QUEUE_NAMES.OUTBOUND_RETRY) {
    return {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: 50,
    };
  }

  return {
    removeOnComplete: env.QUEUE_REMOVE_ON_COMPLETE_COUNT,
    removeOnFail: env.QUEUE_REMOVE_ON_FAIL_COUNT,
    attempts: env.INBOUND_JOB_ATTEMPTS,
    backoff: {
      type: "exponential",
      delay: env.INBOUND_JOB_BACKOFF_MS,
    },
  };
}

/**
 * @param {string} queueName
 * @returns {import('bullmq').Queue}
 */
function getOrCreateQueue(queueName) {
  const existing = queuesByName.get(queueName);

  if (existing) {
    return existing;
  }

  const queue = new Queue(queueName, {
    connection: getRedisConnection(),
    defaultJobOptions: getQueueDefaultJobOptions(queueName),
  });

  queuesByName.set(queueName, queue);

  logger.info({ queueName }, "BullMQ queue registered");

  return queue;
}

/**
 * @param {string} queueName
 * @param {import('bullmq').Processor} processor
 * @param {{ concurrency?: number, defaultJobOptions?: import('bullmq').JobsOptions }} [options]
 * @returns {import('bullmq').Worker}
 */
function createWorker(queueName, processor, options = {}) {
  const worker = new Worker(queueName, processor, {
    connection: getRedisConnection(),
    concurrency: options.concurrency ?? env.INBOUND_QUEUE_CONCURRENCY,
  });

  attachWorkerObservability(worker, queueName);
  registeredWorkers.push(worker);

  logger.info(
    {
      queueName,
      concurrency: options.concurrency ?? env.INBOUND_QUEUE_CONCURRENCY,
    },
    "BullMQ worker registered"
  );

  return worker;
}

/**
 * @param {import('bullmq').Worker} worker
 * @param {string} queueName
 */
function attachWorkerObservability(worker, queueName) {
  worker.on("active", (job) => {
    logger.info(
      {
        queueName,
        jobName: job.name,
        jobId: job.id,
        attemptsMade: job.attemptsMade,
        providerMessageId: job.data?.providerMessageId || null,
      },
      "Queue job active"
    );
  });

  worker.on("completed", (job, result) => {
    const startedAt = job.processedOn || job.timestamp;
    const durationMs =
      startedAt && job.finishedOn ? job.finishedOn - startedAt : undefined;

    logger.info(
      {
        queueName,
        jobName: job.name,
        jobId: job.id,
        attemptsMade: job.attemptsMade,
        providerMessageId: job.data?.providerMessageId || null,
        durationMs,
        result: result ? "ok" : null,
      },
      "Queue job completed"
    );
  });

  worker.on("failed", (job, error) => {
    logger.error(
      {
        queueName,
        jobName: job?.name,
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        maxAttempts: job?.opts?.attempts,
        providerMessageId: job?.data?.providerMessageId || null,
        errorMessage: error?.message,
      },
      "Queue job failed"
    );
  });

  worker.on("error", (error) => {
    logger.error(
      {
        queueName,
        errorMessage: error.message,
      },
      "Queue worker error"
    );
  });
}

async function closeAllQueues() {
  const closeOps = [];

  for (const [queueName, queue] of queuesByName.entries()) {
    closeOps.push(
      queue.close().then(() => {
        logger.info({ queueName }, "BullMQ queue closed");
      })
    );
  }

  await Promise.all(closeOps);
  queuesByName.clear();
}

async function closeAllWorkers() {
  const closeOps = registeredWorkers.map((worker) => worker.close());
  await Promise.all(closeOps);
  registeredWorkers.length = 0;
  logger.info("All BullMQ workers closed");
}

module.exports = {
  buildProviderMessageJobId,
  getOrCreateQueue,
  createWorker,
  closeAllQueues,
  closeAllWorkers,
};
