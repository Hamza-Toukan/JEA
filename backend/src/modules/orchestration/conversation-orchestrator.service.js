const {
  handleIncomingCustomerMessage,
  saveBotReply
} = require("../conversations/conversation.service");

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

async function processIncomingMessage({ from, text, provider = "mock", providerMessageId, metadata = {} }) {
  const { conversation, inboundMessage } = await handleIncomingCustomerMessage({
    customerPhone: from,
    text,
    provider,
    providerMessageId,
    metadata
  });

  const replyText = buildDefaultBotReply(text);

  const outboundMessage = await saveBotReply({
    conversationId: conversation._id,
    text: replyText,
    provider,
    metadata: {
      generatedBy: "default-rule-orchestrator",
      inboundMessageId: inboundMessage._id
    }
  });

  return {
    conversation,
    inboundMessage,
    outboundMessage,
    replyText
  };
}

module.exports = {
  processIncomingMessage
};