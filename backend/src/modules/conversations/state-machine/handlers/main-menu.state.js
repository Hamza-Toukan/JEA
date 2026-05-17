const { CONVERSATION_STATES } = require("../states.constants");
const {
  InteractiveResponse,
} = require("../../../channels/whatsapp/contracts/interactive-response.contract");

const MAIN_MENU_OPTIONS = [
  { id: "membership", title: "خدمات العضوية" },
  { id: "insurance", title: "التأمين الصحي" },
  { id: "support", title: "الدعم الفني" },
  { id: "tickets", title: "التذاكر" },
];

function buildMainMenuInteractiveResponse(memberName) {
  const greeting = memberName ? `مرحبًا ${memberName}.\n\n` : "";

  return new InteractiveResponse({
    messageType: "interactive",
    body: `${greeting}اختر الخدمة المطلوبة`,
    options: MAIN_MENU_OPTIONS,
    nextState: CONVERSATION_STATES.MAIN_MENU,
  });
}

/**
 * Resolves menu selection from interactive id, legacy numeric keys, or keywords.
 * @param {string} text
 * @returns {string | null}
 */
function resolveMainMenuSelection(text) {
  const normalized = (text || "").trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const directIds = ["membership", "insurance", "support", "tickets"];

  if (directIds.includes(normalized)) {
    return normalized;
  }

  const numericMap = {
    "1": "insurance",
    "2": "membership",
    "3": "support",
    "4": "tickets",
  };

  if (numericMap[normalized]) {
    return numericMap[normalized];
  }

  if (normalized.includes("تأمين")) {
    return "insurance";
  }

  if (normalized.includes("عضوية") || normalized.includes("اشتراك")) {
    return "membership";
  }

  if (
    normalized.includes("موظف") ||
    normalized.includes("حدا") ||
    normalized.includes("بشر") ||
    normalized.includes("دعم")
  ) {
    return "support";
  }

  if (normalized.includes("تذكرة") || normalized.includes("ticket")) {
    return "tickets";
  }

  if (normalized === "0" || normalized.includes("قائمة") || normalized.includes("رئيس")) {
    return "menu";
  }

  return null;
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult | InteractiveResponse}
 */
function handleMainMenuState(context) {
  const text = (context.text || "").trim();
  const memberName = context.conversation.memberName || "";
  const selection = resolveMainMenuSelection(text);

  if (!text || selection === "menu") {
    return buildMainMenuInteractiveResponse(memberName);
  }

  if (selection === "support") {
    return {
      replyText:
        "تم تحويل طلبك لفريق الدعم. سيقوم موظف بالرد عليك في أقرب وقت.",
      nextState: CONVERSATION_STATES.HUMAN_HANDOFF,
      setModeHuman: true,
      conversationUpdates: {
        ticketStatus: "pending",
      },
    };
  }

  if (selection === "insurance") {
    return {
      replyText:
        "بخصوص التأمين الصحي، سيتم لاحقًا ربط المساعد بقاعدة المعرفة الرسمية. " +
        "حاليًا تم تسجيل استفسارك. أرسل 0 للعودة للقائمة الرئيسية.",
      nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
      conversationUpdates: {
        metadata: { serviceTopic: "insurance" },
      },
    };
  }

  if (selection === "membership") {
    return {
      replyText:
        "بخصوص العضوية والاشتراكات، سيتم تفعيل الخدمات الذكية قريبًا. " +
        "حاليًا تم تسجيل استفسارك. أرسل 0 للعودة للقائمة الرئيسية.",
      nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
      conversationUpdates: {
        metadata: { serviceTopic: "membership" },
      },
    };
  }

  if (selection === "tickets") {
    return {
      replyText:
        "صف طلبك أو الخدمة المطلوبة وسنسجّلها. أرسل 0 للعودة للقائمة الرئيسية.",
      nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
      conversationUpdates: {
        metadata: { serviceTopic: "tickets" },
      },
    };
  }

  return {
    replyText:
      "شكرًا لتواصلك. تم تسجيل رسالتك وسيتم تطوير الردود الذكية في المرحلة القادمة.\n\n" +
      "أرسل 0 لعرض القائمة الرئيسية.",
    nextState: CONVERSATION_STATES.MAIN_MENU,
  };
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult | InteractiveResponse}
 */
function handleCollectingServiceDataState(context) {
  const text = (context.text || "").trim();
  const memberName = context.conversation.memberName || "";
  const selection = resolveMainMenuSelection(text);

  if (selection === "menu") {
    return buildMainMenuInteractiveResponse(memberName);
  }

  if (text.includes("مرفق") || text.includes("ملف") || text.includes("صورة")) {
    return {
      replyText:
        "يرجى إرسال المرفق المطلوب. (معالجة المرفقات ستُفعّل في مرحلة لاحقة.)",
      nextState: CONVERSATION_STATES.AWAITING_ATTACHMENT,
    };
  }

  return {
    replyText:
      "تم تسجيل تفاصيل طلبك. إذا كنت بحاجة لإرسال مرفق، اكتب \"مرفق\". " +
      "أو أرسل 0 للعودة للقائمة الرئيسية.",
    nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
  };
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult | InteractiveResponse}
 */
function handleAwaitingAttachmentState(context) {
  const text = (context.text || "").trim();
  const memberName = context.conversation.memberName || "";
  const selection = resolveMainMenuSelection(text);

  if (selection === "menu") {
    return buildMainMenuInteractiveResponse(memberName);
  }

  return {
    replyText:
      "شكرًا. تم تسجيل طلب المرفق وسيتم دعم رفع الملفات قريبًا. أرسل 0 للقائمة الرئيسية.",
    nextState: CONVERSATION_STATES.AWAITING_ATTACHMENT,
  };
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult | InteractiveResponse}
 */
function handleResolvedState(context) {
  const memberName = context.conversation.memberName || "";

  return {
    replyText:
      `تم إغلاق طلبك السابق. ${memberName ? `مرحبًا ${memberName}. ` : ""}` +
      "أرسل أي رسالة لعرض القائمة الرئيسية.",
    nextState: CONVERSATION_STATES.MAIN_MENU,
    conversationUpdates: {
      ticketStatus: "open",
    },
  };
}

module.exports = {
  handleMainMenuState,
  handleCollectingServiceDataState,
  handleAwaitingAttachmentState,
  handleResolvedState,
  buildMainMenuInteractiveResponse,
  resolveMainMenuSelection,
  MAIN_MENU_OPTIONS,
};
