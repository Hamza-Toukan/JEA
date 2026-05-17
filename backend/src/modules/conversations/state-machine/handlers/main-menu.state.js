const { CONVERSATION_STATES } = require("../states.constants");

function buildMainMenuText(memberName) {
  const greeting = memberName ? `مرحبًا ${memberName}.\n\n` : "";
  return (
    `${greeting}القائمة الرئيسية:\n` +
    "1 — التأمين الصحي\n" +
    "2 — العضوية والاشتراكات\n" +
    "3 — التحدث مع موظف\n" +
    "4 — خدمات أخرى\n\n" +
    "أرسل رقم الخيار أو اكتب موضوع استفسارك."
  );
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleMainMenuState(context) {
  const text = (context.text || "").trim();
  const memberName = context.conversation.memberName || "";

  if (!text) {
    return {
      replyText: buildMainMenuText(memberName),
      nextState: CONVERSATION_STATES.MAIN_MENU,
    };
  }

  if (
    text === "3" ||
    text.includes("موظف") ||
    text.includes("حدا") ||
    text.includes("بشر")
  ) {
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

  if (text === "1" || text.includes("تأمين")) {
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

  if (text === "2" || text.includes("عضوية") || text.includes("اشتراك")) {
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

  if (text === "0" || text.includes("قائمة") || text.includes("رئيس")) {
    return {
      replyText: buildMainMenuText(memberName),
      nextState: CONVERSATION_STATES.MAIN_MENU,
    };
  }

  if (text === "4") {
    return {
      replyText:
        "صف طلبك أو الخدمة المطلوبة وسنسجّلها. أرسل 0 للعودة للقائمة الرئيسية.",
      nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
      conversationUpdates: {
        metadata: { serviceTopic: "other" },
      },
    };
  }

  return {
    replyText:
      "شكرًا لتواصلك. تم تسجيل رسالتك وسيتم تطوير الردود الذكية في المرحلة القادمة.\n\n" +
      buildMainMenuText(memberName),
    nextState: CONVERSATION_STATES.MAIN_MENU,
  };
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleCollectingServiceDataState(context) {
  const text = (context.text || "").trim();
  const memberName = context.conversation.memberName || "";

  if (text === "0" || text.includes("قائمة") || text.includes("رئيس")) {
    return {
      replyText: buildMainMenuText(memberName),
      nextState: CONVERSATION_STATES.MAIN_MENU,
    };
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
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleAwaitingAttachmentState(context) {
  const text = (context.text || "").trim();
  const memberName = context.conversation.memberName || "";

  if (text === "0") {
    return {
      replyText: buildMainMenuText(memberName),
      nextState: CONVERSATION_STATES.MAIN_MENU,
    };
  }

  return {
    replyText:
      "شكرًا. تم تسجيل طلب المرفق وسيتم دعم رفع الملفات قريبًا. أرسل 0 للقائمة الرئيسية.",
    nextState: CONVERSATION_STATES.AWAITING_ATTACHMENT,
  };
}

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleResolvedState(context) {
  const memberName = context.conversation.memberName || "";

  return {
    replyText:
      `تم إغلاق طلبك السابق. ${memberName ? `مرحبًا ${memberName}. ` : ""}` +
      buildMainMenuText(memberName),
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
  buildMainMenuText,
};
