const QUEUE_NAMES = {
  INBOUND_MESSAGE_PROCESSING: "inbound-message-processing",
  OUTBOUND_RETRY: "outbound-retry",
};

const JOB_NAMES = {
  PROCESS_INBOUND: "process-inbound",
  RECONCILE_FAILED_OUTBOUND: "reconcile-failed-outbound",
};

/** Stable repeatable job id for outbound reconciliation scheduler. */
const OUTBOUND_RETRY_REPEATABLE_JOB_ID = "outbound-retry-reconcile";

module.exports = {
  QUEUE_NAMES,
  JOB_NAMES,
  OUTBOUND_RETRY_REPEATABLE_JOB_ID,
};
