const {
  handleIncomingCustomerMessage,
  saveBotReply,
  findExistingBotReplyForInbound,
} = require("../conversations/conversation.service");
const { logger } = require("../../core/logger/logger");

function buildDefaultBotReply(text) {
  const normalizedText = (text || "").trim();

  if (!normalizedText) {
    return "أهلًا بك في المساعد الرقمي لنقابة المهندسين. كيف يمكنني مساعدتك؟";
  }

  if (normalizedText.includes("موظف") || normalizedText.includes("حدا")) {
    return "تم استلام طلبك للتواصل مع موظف. سيتم تحويل المحادثة لاحقًا عند تفعيل نظام التحويل.";
  }

  if (normalizedText.includes("تأمين")) {
    return "بخصوص التأمين الصحي، سيتم لاحقًا ربط المساعد بقاعدة المعرفة الرسمية للنقابة. حاليًا تم تسجيل استفسارك.";
  }

  if (normalizedText.includes("عضوية")) {
    return "بخصوص العضوية، سيتم لاحقًا تفعيل التحقق من بيانات العضو. حاليًا تم تسجيل استفسارك.";
  }

  return "أهلًا بك في المساعد الرقمي لنقابة المهندسين. وصلت رسالتك، وسيتم تطوير الردود الذكية وقاعدة المعرفة في المرحلة القادمة.";
}

async function processIncomingMessage({
  from,
  text,
  provider = "mock",
  providerMessageId,
  metadata = {},
}) {
  const { conversation, inboundMessage, inboundWasDuplicate } =
    await handleIncomingCustomerMessage({
      customerPhone: from,
      text,
      provider,
      providerMessageId,
      metadata,
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

  const replyText = buildDefaultBotReply(text);

  const outboundMessage = await saveBotReply({
    conversationId: conversation._id,
    text: replyText,
    provider,
    metadata: {
      generatedBy: "default-rule-orchestrator",
      inboundMessageId: inboundMessage._id,
    },
  });

  return {
    conversation,
    inboundMessage,
    outboundMessage,
    replyText,
  };
}

module.exports = {
  processIncomingMessage,
};
