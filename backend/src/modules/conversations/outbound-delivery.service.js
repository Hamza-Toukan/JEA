const { env } = require("../../core/config/env");
const { logger } = require("../../core/logger/logger");
const { validateObjectId } = require("../../core/utils/validate-object-id");
const { Message } = require("./message.model");
const { Conversation } = require("./conversation.model");
const { sendMessage } = require("../channels/messaging.service");

const DELIVERY_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
};

function computeRetryBackoffMs(attempts) {
  const baseMs = env.OUTBOUND_RETRY_BACKOFF_BASE_MS;
  const cappedExponent = Math.min(Math.max(attempts, 0), 6);
  return Math.min(baseMs * 2 ** cappedExponent, 3_600_000);
}

function isReadyForRetry(message) {
  if (!message || message.deliveryStatus !== DELIVERY_STATUS.FAILED) {
    return false;
  }

  const attempts = Number(message.deliveryAttempts) || 0;

  if (attempts >= env.OUTBOUND_DELIVERY_MAX_ATTEMPTS) {
    return false;
  }

  const updatedAt = message.updatedAt ? new Date(message.updatedAt) : new Date(0);
  const backoffMs = computeRetryBackoffMs(attempts);
  return Date.now() - updatedAt.getTime() >= backoffMs;
}

/**
 * @param {import('mongoose').Types.ObjectId | string} messageId
 * @param {string} providerMessageId
 * @param {Record<string, unknown>} [metadataPatch]
 */
async function markOutboundDeliverySent(
  messageId,
  providerMessageId,
  metadataPatch = {}
) {
  if (!validateObjectId(messageId)) {
    return null;
  }

  const existing = await Message.findById(messageId).select("metadata").lean();

  if (!existing) {
    return null;
  }

  const update = {
    deliveryStatus: DELIVERY_STATUS.SENT,
    sentAt: new Date(),
    lastDeliveryError: null,
    providerMessageId: String(providerMessageId),
    metadata: {
      ...(existing.metadata || {}),
      ...metadataPatch,
    },
  };

  return Message.findByIdAndUpdate(messageId, update, { new: true }).lean();
}

/**
 * @param {import('mongoose').Types.ObjectId | string} messageId
 * @param {string} errorMessage
 */
async function markOutboundDeliveryFailed(messageId, errorMessage) {
  if (!validateObjectId(messageId)) {
    return null;
  }

  const existing = await Message.findById(messageId)
    .select("deliveryAttempts")
    .lean();

  if (!existing) {
    return null;
  }

  const nextAttempts = (Number(existing.deliveryAttempts) || 0) + 1;

  return Message.findByIdAndUpdate(
    messageId,
    {
      deliveryStatus: DELIVERY_STATUS.FAILED,
      deliveryAttempts: nextAttempts,
      lastDeliveryError: String(errorMessage || "Unknown delivery error").slice(
        0,
        2000
      ),
    },
    { new: true }
  ).lean();
}

/**
 * Sends transport payload for an existing outbound message and updates delivery lifecycle.
 *
 * @param {Object} params
 * @param {import('mongoose').Types.ObjectId | string} params.outboundMessageId
 * @param {string} params.to - Customer phone (no whatsapp: prefix required)
 * @param {import('../channels/transport/transport-payload.contract').TransportPayload} params.transportPayload
 * @param {Record<string, unknown>} [params.logContext]
 */
async function deliverOutboundMessage({
  outboundMessageId,
  to,
  transportPayload,
  logContext = {},
}) {
  const startedAt = Date.now();
  const conversationId = logContext.conversationId
    ? String(logContext.conversationId)
    : null;

  const baseLog = {
    conversationId,
    outboundMessageId: String(outboundMessageId),
    transportPayloadType: transportPayload?.type,
    resolvedTemplateKey:
      transportPayload?.type === "approved_template"
        ? transportPayload.templateKey
        : logContext.resolvedTemplateKey || null,
    deliveryStatus: DELIVERY_STATUS.PENDING,
    ...logContext,
  };

  try {
    const sendResult = await sendMessage({
      channel: "whatsapp",
      to,
      payload: transportPayload,
    });

    if (
      sendResult?.providerMessageId &&
      sendResult.delivered !== false
    ) {
      const metadataPatch = sendResult.templateDelivery
        ? {
            templateKey: sendResult.templateDelivery.templateKey,
            contentSid: sendResult.templateDelivery.contentSid,
            templateVariables: sendResult.templateDelivery.templateVariables,
            templateCategory: sendResult.templateDelivery.templateCategory,
          }
        : {};

      await markOutboundDeliverySent(
        outboundMessageId,
        sendResult.providerMessageId,
        metadataPatch
      );

      logger.info(
        {
          ...baseLog,
          deliveryStatus: DELIVERY_STATUS.SENT,
          providerMessageId: sendResult.providerMessageId,
          durationMs: Date.now() - startedAt,
        },
        "Outbound message delivery succeeded"
      );

      return {
        delivered: true,
        providerMessageId: sendResult.providerMessageId,
        deliveryStatus: DELIVERY_STATUS.SENT,
      };
    }

    throw new Error("Provider returned no deliverable message id");
  } catch (error) {
    const updated = await markOutboundDeliveryFailed(
      outboundMessageId,
      error.message
    );

    logger.error(
      {
        ...baseLog,
        deliveryStatus: DELIVERY_STATUS.FAILED,
        deliveryAttempts: updated?.deliveryAttempts,
        lastDeliveryError: error.message,
        durationMs: Date.now() - startedAt,
      },
      "Outbound message delivery failed"
    );

    return {
      delivered: false,
      deliveryStatus: DELIVERY_STATUS.FAILED,
      errorMessage: error.message,
    };
  }
}

/**
 * Retries failed outbound bot messages using frozen metadata.transportPayload.
 *
 * @param {{ limit?: number }} [options]
 */
async function retryFailedOutboundMessages(options = {}) {
  const limit = Math.min(
    Math.max(Number(options.limit) || env.OUTBOUND_RETRY_BATCH_SIZE, 1),
    100
  );

  const candidates = await Message.find({
    direction: "outbound",
    senderType: "bot",
    deliveryStatus: DELIVERY_STATUS.FAILED,
    deliveryAttempts: { $lt: env.OUTBOUND_DELIVERY_MAX_ATTEMPTS },
    "metadata.transportPayload": { $exists: true, $ne: null },
  })
    .sort({ updatedAt: 1 })
    .limit(limit)
    .lean();

  let retried = 0;
  let succeeded = 0;
  let skipped = 0;

  for (const message of candidates) {
    if (!isReadyForRetry(message)) {
      skipped += 1;
      continue;
    }

    const transportPayload = message.metadata?.transportPayload;

    if (!transportPayload || !transportPayload.type) {
      skipped += 1;
      continue;
    }

    const conversation = await Conversation.findById(message.conversationId)
      .select("customerPhone")
      .lean();

    if (!conversation?.customerPhone) {
      skipped += 1;
      continue;
    }

    retried += 1;

    const result = await deliverOutboundMessage({
      outboundMessageId: message._id,
      to: conversation.customerPhone,
      transportPayload,
      logContext: {
        conversationId: message.conversationId,
        resolvedTemplateKey: message.metadata?.resolvedTemplateKey || null,
        source: "outbound-retry-worker",
      },
    });

    if (result.delivered) {
      succeeded += 1;
    }
  }

  if (retried > 0) {
    logger.info(
      {
        retried,
        succeeded,
        skipped,
        candidateCount: candidates.length,
      },
      "Outbound retry reconciliation pass completed"
    );
  }

  return { retried, succeeded, skipped, candidateCount: candidates.length };
}

module.exports = {
  DELIVERY_STATUS,
  computeRetryBackoffMs,
  isReadyForRetry,
  markOutboundDeliverySent,
  markOutboundDeliveryFailed,
  deliverOutboundMessage,
  retryFailedOutboundMessages,
};
