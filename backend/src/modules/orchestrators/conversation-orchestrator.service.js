const {
  handleIncomingCustomerMessage,
  saveBotReply,
  findExistingBotReplyForInbound,
} = require("../conversations/conversation.service");
const {
  deliverOutboundMessage,
  DELIVERY_STATUS,
} = require("../conversations/outbound-delivery.service");
const { routeConversationState } = require("../conversations/state-machine/state-router");
const {
  buildInteractiveMessage,
} = require("../channels/whatsapp/builders/interactive-message.builder");
const {
  formatTwilioPayload,
} = require("../channels/whatsapp/formatters/twilio-payload.formatter");
const {
  tryBuildStructuralTemplateTransport,
} = require("../channels/whatsapp/templates/structural-template-delivery.service");
const {
  inferStructureFromRenderedMessage,
} = require("../channels/whatsapp/templates/interactive-template-resolver.service");
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
      const transportPayload = existingOutbound.metadata?.transportPayload;
      const needsRedelivery =
        transportPayload &&
        (existingOutbound.deliveryStatus === DELIVERY_STATUS.FAILED ||
          existingOutbound.deliveryStatus === DELIVERY_STATUS.PENDING);

      if (needsRedelivery) {
        await deliverOutboundMessage({
          outboundMessageId: existingOutbound._id,
          to: inbound.from,
          transportPayload,
          logContext: {
            conversationId: String(conversation._id),
            resolvedTemplateKey:
              existingOutbound.metadata?.resolvedTemplateKey || null,
            source: "duplicate-inbound-retry",
          },
        });
      }

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
  let structuralDelivery = null;

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

    structuralDelivery = tryBuildStructuralTemplateTransport(renderedMessage);
  }

  if (structuralDelivery) {
    transportPayload = structuralDelivery.payload;

    logger.info(
      {
        conversationId: String(conversationAfterState._id),
        transportPayloadType: transportPayload.type,
        structureType: structuralDelivery.structureType,
        optionCount: structuralDelivery.optionCount,
        resolvedTemplateKey: structuralDelivery.templateKey,
        usingApprovedTemplate: true,
        fallbackReason: null,
      },
      "Using structural approved template transport"
    );
  } else {
    transportPayload = formatTwilioPayload(
      renderedMessage || { type: "text", body: trimmedReply }
    );

    const runtimeStructure = renderedMessage
      ? inferStructureFromRenderedMessage(renderedMessage)
      : null;

    logger.info(
      {
        conversationId: String(conversationAfterState._id),
        transportPayloadType: transportPayload.type,
        structureType: runtimeStructure?.type ?? null,
        optionCount: runtimeStructure?.optionCount ?? null,
        resolvedTemplateKey: null,
        usingApprovedTemplate: false,
        fallbackReason: renderedMessage
          ? "STRUCTURAL_TEMPLATE_UNAVAILABLE"
          : null,
      },
      "Using runtime transport payload (text or dynamic interactive)"
    );
  }

  const activeProvider = getActiveWhatsAppProviderId();

  const isApprovedTemplate = transportPayload.type === "approved_template";
  const persistText = isApprovedTemplate
    ? `[template:${transportPayload.templateKey}]`
    : trimmedReply;

  const outboundMessage = await saveBotReply({
    conversationId: conversationAfterState._id,
    text: persistText,
    provider: activeProvider,
    messageType: isApprovedTemplate
      ? "system"
      : renderedMessage
        ? "interactive"
        : "text",
    metadata: {
      generatedBy: "state-machine-orchestrator",
      inboundMessageId: inboundMessage._id,
      conversationState: conversationAfterState.conversationState,
      ...(renderedMessage ? { renderedMessage } : {}),
      transportPayload,
      ...(structuralDelivery
        ? {
            templateKind: "structural",
            structureType: structuralDelivery.structureType,
            optionCount: structuralDelivery.optionCount,
            resolvedTemplateKey: structuralDelivery.templateKey,
            templateVariables: structuralDelivery.variables,
          }
        : {}),
      ...(isApprovedTemplate
        ? {
            templateKey: transportPayload.templateKey,
            templateVariables: transportPayload.variables,
          }
        : {}),
      ...(interactiveResponse?.metadata || {}),
    },
  });

  await deliverOutboundMessage({
    outboundMessageId: outboundMessage._id,
    to: inbound.from,
    transportPayload,
    logContext: {
      conversationId: String(conversationAfterState._id),
      provider: activeProvider,
      resolvedTemplateKey:
        structuralDelivery?.templateKey ||
        (isApprovedTemplate ? transportPayload.templateKey : null),
      source: "orchestrator",
    },
  });

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
