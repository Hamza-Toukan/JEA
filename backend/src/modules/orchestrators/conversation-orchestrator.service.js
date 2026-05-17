const {
  handleIncomingCustomerMessage,
  saveBotReply,
  findExistingBotReplyForInbound,
} = require("../conversations/conversation.service");
const { routeConversationState } = require("../conversations/state-machine/state-router");
const { sendMessage } = require("../channels/messaging.service");
const {
  buildInteractiveMessage,
} = require("../channels/whatsapp/builders/interactive-message.builder");
const {
  formatTwilioPayload,
} = require("../channels/whatsapp/formatters/twilio-payload.formatter");
const {
  getActiveWhatsAppProviderId,
} = require("../channels/providers/provider-factory");
const { logger } = require("../../core/logger/logger");

/**
 * Normalizes channel webhook input into a consistent inbound shape.
 */
function normalizeInboundEvent({
  from,
  text,
  provider,
  providerMessageId,
  metadata,
}) {
  return {
    from: typeof from === "string" ? from.trim() : "",
    text: typeof text === "string" ? text : "",
    provider: provider || "mock",
    providerMessageId: providerMessageId || null,
    metadata: metadata || {},
  };
}

async function processIncomingMessage(params) {
  const inbound = normalizeInboundEvent(params);

  const { conversation, inboundMessage, inboundWasDuplicate } =
    await handleIncomingCustomerMessage({
      customerPhone: inbound.from,
      text: inbound.text,
      provider: inbound.provider,
      providerMessageId: inbound.providerMessageId,
      metadata: inbound.metadata,
    });

  if (inboundWasDuplicate) {
    const existingOutbound = await findExistingBotReplyForInbound(
      conversation._id,
      inboundMessage._id
    );

    if (existingOutbound) {
      return {
        conversation,
        inboundMessage,
        outboundMessage: existingOutbound,
        replyText: existingOutbound.text || "",
      };
    }
  }

  if (conversation.mode === "human") {
    logger.info(
      {
        conversationId: String(conversation._id),
        conversationState: conversation.conversationState,
      },
      `[Orchestrator] Human mode active for conversation ${conversation._id}, skipping bot reply`
    );

    return {
      conversation,
      inboundMessage,
      outboundMessage: null,
      replyText: "",
    };
  }

  const {
    replyText,
    interactiveResponse,
    conversation: conversationAfterState,
  } = await routeConversationState({
    conversation,
    text: inbound.text,
    inboundMessage,
  });

  const trimmedReply = String(replyText || "").trim();

  if (!trimmedReply) {
    return {
      conversation: conversationAfterState,
      inboundMessage,
      outboundMessage: null,
      replyText: "",
      renderedMessage: null,
      transportPayload: null,
    };
  }

  let renderedMessage = null;
  let transportPayload = null;

  if (interactiveResponse && interactiveResponse.isInteractive()) {
    renderedMessage = buildInteractiveMessage({
      body: interactiveResponse.body,
      options: interactiveResponse.options,
      listSectionTitle: "الخدمات المتاحة",
    });

    logger.info(
      {
        conversationId: String(conversationAfterState._id),
        conversationState: conversationAfterState.conversationState,
        renderedType: renderedMessage.type,
        optionCount: interactiveResponse.options.length,
      },
      "Interactive message rendered"
    );
  }

  transportPayload = formatTwilioPayload(
    renderedMessage || { type: "text", body: trimmedReply }
  );

  logger.info(
    {
      conversationId: String(conversationAfterState._id),
      transportPayloadType: transportPayload.type,
    },
    "Twilio transport payload formatted"
  );

  const activeProvider = getActiveWhatsAppProviderId();

  const outboundMessage = await saveBotReply({
    conversationId: conversationAfterState._id,
    text: trimmedReply,
    provider: activeProvider,
    messageType: renderedMessage ? "interactive" : "text",
    metadata: {
      generatedBy: "state-machine-orchestrator",
      inboundMessageId: inboundMessage._id,
      conversationState: conversationAfterState.conversationState,
      ...(renderedMessage ? { renderedMessage } : {}),
      transportPayload,
      ...(interactiveResponse?.metadata || {}),
    },
  });

  try {
    await sendMessage({
      channel: "whatsapp",
      to: inbound.from,
      payload: transportPayload,
    });
  } catch (error) {
    logger.error(
      {
        conversationId: String(conversationAfterState._id),
        provider: activeProvider,
        errorMessage: error.message,
      },
      "Outbound WhatsApp delivery failed after bot reply was persisted"
    );
  }

  return {
    conversation: conversationAfterState,
    inboundMessage,
    outboundMessage,
    replyText: trimmedReply,
    renderedMessage,
    transportPayload,
  };
}

module.exports = {
  normalizeInboundEvent,
  processIncomingMessage,
};
