const {
  processIncomingMessage,
} = require("../../../orchestrators/conversation-orchestrator.service");
const { logger } = require("../../../../core/logger/logger");
const { parseTwilioInboundMessage } = require("./twilio-inbound-parser");

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

  logger.info(
    {
      requestId: req.requestId,
      MessageSid: messageSid || null,
      From: fromRaw || null,
      provider: "twilio",
      interactiveReplyType: parsedInbound.interactiveReply?.interactiveReplyType || null,
      selectedId: parsedInbound.interactiveReply?.selectedId || null,
      selectedTitle: parsedInbound.interactiveReply?.selectedTitle || null,
    },
    "Twilio WhatsApp webhook received"
  );

  const twimlEmpty = "<Response></Response>";

  try {
    if (!messageSid) {
      res.type("text/xml").send(twimlEmpty);
      return;
    }

    const from = stripWhatsAppPrefix(fromRaw || "");

    await processIncomingMessage({
      from,
      text: parsedInbound.text,
      provider: "twilio",
      providerMessageId: messageSid,
      metadata: parsedInbound.metadata,
    });

    res.type("text/xml").send(twimlEmpty);
  } catch (error) {
    logger.error(
      {
        requestId: req.requestId,
        MessageSid: messageSid || null,
        From: fromRaw || null,
        errorMessage: error.message,
      },
      "Twilio WhatsApp webhook processing failed"
    );

    res.type("text/xml").send(twimlEmpty);
  }
}

module.exports = {
  handleTwilioWebhook,
};
