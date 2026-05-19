const { logger } = require("../../../../core/logger/logger");
const { parseTwilioInboundMessage } = require("./twilio-inbound-parser");
const {
  processIncomingMessage,
} = require("../../../orchestrators/conversation-orchestrator.service");
const {
  isAsyncInboundProcessingEnabled,
  enqueueInboundMessageJob,
} = require("../../../../core/queue/inbound-message.queue");

const TWIML_EMPTY = "<Response></Response>";

function stripWhatsAppPrefix(from) {
  if (typeof from !== "string") {
    return "";
  }
  return from.replace(/^whatsapp:/i, "").trim();
}

async function handleTwilioWebhook(req, res) {
  const messageSid = req.body.MessageSid;
  const fromRaw = req.body.From;
  const parsedInbound = parseTwilioInboundMessage(req.body);
  const customerPhone = stripWhatsAppPrefix(fromRaw || "");
  const webhookStartedAt = Date.now();

  logger.info(
    {
      requestId: req.requestId,
      MessageSid: messageSid || null,
      providerMessageId: messageSid || null,
      From: fromRaw || null,
      customerPhone: customerPhone || null,
      provider: "twilio",
      twilioSignatureValid:
        req.twilioSignatureValid === undefined ? null : req.twilioSignatureValid,
      asyncInbound: isAsyncInboundProcessingEnabled(),
      interactiveReplyType:
        parsedInbound.interactiveReply?.interactiveReplyType || null,
      selectedId: parsedInbound.interactiveReply?.selectedId || null,
      selectedTitle: parsedInbound.interactiveReply?.selectedTitle || null,
    },
    "Twilio WhatsApp webhook received"
  );

  try {
    if (!messageSid) {
      res.type("text/xml").send(TWIML_EMPTY);
      return;
    }

    const inboundPayload = {
      from: customerPhone,
      text: parsedInbound.text,
      provider: "twilio",
      providerMessageId: messageSid,
      metadata: parsedInbound.metadata,
      requestId: req.requestId,
    };

    if (isAsyncInboundProcessingEnabled()) {
      await enqueueInboundMessageJob(inboundPayload);

      logger.info(
        {
          requestId: req.requestId,
          providerMessageId: messageSid,
          customerPhone,
          durationMs: Date.now() - webhookStartedAt,
        },
        "Twilio webhook acknowledged; inbound job enqueued"
      );

      res.type("text/xml").send(TWIML_EMPTY);
      return;
    }

    logger.warn(
      {
        requestId: req.requestId,
        providerMessageId: messageSid,
      },
      "Async inbound processing disabled; falling back to synchronous orchestration"
    );

    await processIncomingMessage(inboundPayload);

    logger.info(
      {
        requestId: req.requestId,
        providerMessageId: messageSid,
        durationMs: Date.now() - webhookStartedAt,
      },
      "Twilio webhook processed synchronously"
    );

    res.type("text/xml").send(TWIML_EMPTY);
  } catch (error) {
    logger.error(
      {
        requestId: req.requestId,
        MessageSid: messageSid || null,
        From: fromRaw || null,
        customerPhone: customerPhone || null,
        errorMessage: error.message,
        durationMs: Date.now() - webhookStartedAt,
      },
      "Twilio WhatsApp webhook handling failed"
    );

    if (isAsyncInboundProcessingEnabled()) {
      res.status(503).type("text/xml").send(TWIML_EMPTY);
      return;
    }

    res.type("text/xml").send(TWIML_EMPTY);
  }
}

module.exports = {
  handleTwilioWebhook,
};
