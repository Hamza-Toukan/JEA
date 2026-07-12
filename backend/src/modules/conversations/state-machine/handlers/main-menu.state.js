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
    return new InteractiveResponse({
      messageType: "interactive",
      body: "أهلاً بك في دليل التأمين الصحي لنقابة المهندسين الأردنيين لعام 2026. 🩺\n\nالرجاء اختيار أحد الأقسام التالية للحصول على التفاصيل:",
      options: [
        { id: "sub_programs", title: "برامج المشتركين" },
        { id: "parents_shabab", title: "الوالدين والشباب" },
        { id: "terms_docs", title: "الشروط والوثائق" },
      ],
      nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
      conversationUpdates: {
        metadata: { serviceTopic: "insurance", insuranceStep: "menu" },
      },
    });
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
    return new InteractiveResponse({
      messageType: "interactive",
      body: memberName ? `مرحبًا ${memberName}.\n\nاختر الخدمة المطلوبة` : "اختر الخدمة المطلوبة",
      options: MAIN_MENU_OPTIONS,
      nextState: CONVERSATION_STATES.MAIN_MENU,
      conversationUpdates: {
        metadata: {} // Clear metadata
      }
    });
  }

  const metadata = context.conversation.metadata || {};
  const serviceTopic = metadata.serviceTopic;

  // Intercept if topic is health insurance
  if (serviceTopic === "insurance") {
    const insuranceStep = metadata.insuranceStep || "menu";
    const normalizedInput = text.trim().toLowerCase();

    // Reset back to main health insurance menu
    if (
      normalizedInput === "insurance_menu" ||
      normalizedInput === "m" ||
      normalizedInput === "م" ||
      normalizedInput === "عودة"
    ) {
      return new InteractiveResponse({
        messageType: "interactive",
        body: "دليل التأمين الصحي لنقابة المهندسين الأردنيين لعام 2026. 🩺\n\nالرجاء اختيار أحد الأقسام التالية للحصول على التفاصيل:",
        options: [
          { id: "sub_programs", title: "برامج المشتركين" },
          { id: "parents_shabab", title: "الوالدين والشباب" },
          { id: "terms_docs", title: "الشروط والوثائق" },
        ],
        nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
        conversationUpdates: {
          metadata: { serviceTopic: "insurance", insuranceStep: "menu" },
        },
      });
    }

    if (insuranceStep === "menu") {
      if (
        normalizedInput === "sub_programs" ||
        normalizedInput === "1" ||
        normalizedInput.includes("مشترك")
      ) {
        return new InteractiveResponse({
          messageType: "interactive",
          body: "برامج المشتركين المتاحة:\n\n1. برنامج أمان: الشامل داخل وخارج المستشفى.\n2. برنامج شفاء: داخل المستشفى فقط.",
          options: [
            { id: "aman", title: "برنامج أمان (الشامل)" },
            { id: "shifa", title: "برنامج شفاء (المستشفى)" },
            { id: "insurance_menu", title: "العودة للخلف" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "sub_programs" },
          },
        });
      }

      if (
        normalizedInput === "parents_shabab" ||
        normalizedInput === "2" ||
        normalizedInput.includes("شباب") ||
        normalizedInput.includes("والد")
      ) {
        return new InteractiveResponse({
          messageType: "interactive",
          body: "برامج الوالدين والشباب:\n\n1. بوليصة الوالدين: لتغطية الآباء والأمهات.\n2. برامج الشباب: للزملاء دون سن 30 عاماً.",
          options: [
            { id: "parents", title: "بوليصة الوالدين" },
            { id: "shabab", title: "المهندسين الشباب" },
            { id: "insurance_menu", title: "العودة للخلف" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "parents_shabab" },
          },
        });
      }

      if (
        normalizedInput === "terms_docs" ||
        normalizedInput === "3" ||
        normalizedInput.includes("شروط") ||
        normalizedInput.includes("وثائق")
      ) {
        return new InteractiveResponse({
          messageType: "interactive",
          body:
            "📋 الشروط العامة والاستثناءات والوثائق المطلوبة:\n\n" +
            "* الأوراق المطلوبة:\n" +
            "  1. دفتر عائلة ساري المفعول، وصور شخصية للمشتركين.\n" +
            "  2. إثبات تأمين آخر في حال استثناء أحد الأبناء دون سن 24 عاماً.\n" +
            "  3. براءة ذمة مالية من صناديق النقابة لعام 2026.\n\n" +
            "* فترات الانتظار للأمراض المزمنة:\n" +
            "  - 6 أشهر من تاريخ بدء الاشتراك للسكري، الضغط، الديسك، الربو.\n\n" +
            "* الاستثناءات الرئيسية:\n" +
            "  - الحالات الوراثية والخلقية والولادية (مثل مرض التفول).\n" +
            "  - علاجات العقم والخصوبة، وعمليات التجميل لغايات غير علاجية.",
          options: [
            { id: "insurance_menu", title: "قائمة التأمين" },
            { id: "menu", title: "القائمة الرئيسية" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "details" },
          },
        });
      }
    }

    if (insuranceStep === "sub_programs") {
      if (normalizedInput === "aman" || normalizedInput.includes("أمان")) {
        return new InteractiveResponse({
          messageType: "interactive",
          body:
            "📋 تفاصيل برنامج أمان (الشامل):\n" +
            "يشمل العلاج داخل وخارج المستشفى، بالإضافة إلى الحمل والولادة.\n\n" +
            "* سقوف التغطية السنوية:\n" +
            "  - الدرجة الخاصة: 15,000 د.أ\n" +
            "  - الدرجة الأولى: 15,000 د.أ\n" +
            "  - الدرجة الثانية: 12,000 د.أ\n\n" +
            "* الأقساط السنوية (أمثلة للدرجة الأولى):\n" +
            "  - أقل من 17 سنة: 267 د.أ\n" +
            "  - من 30 إلى أقل من 35 سنة: 342 د.أ\n\n" +
            "* خصم العائلات: ينطبق خصم 5% على الابن الأول، 10% للثاني، 15% للثالث.",
          options: [
            { id: "sub_programs", title: "برامج المشتركين" },
            { id: "insurance_menu", title: "قائمة التأمين" },
            { id: "menu", title: "القائمة الرئيسية" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "details" },
          },
        });
      }

      if (normalizedInput === "shifa" || normalizedInput.includes("شفاء")) {
        return new InteractiveResponse({
          messageType: "interactive",
          body:
            "📋 تفاصيل برنامج شفاء (داخل المستشفى فقط):\n" +
            "يغطي الإقامة وحالات الإدخال والولادة داخل المستشفى فقط.\n\n" +
            "* سقوف التغطية السنوية:\n" +
            "  - الدرجة الأولى: 15,000 د.أ\n" +
            "  - الدرجة الثانية: 12,000 د.أ\n\n" +
            "* الأقساط السنوية (أمثلة للدرجة الأولى):\n" +
            "  - أقل من 17 سنة: 182 د.أ\n" +
            "  - من 30 إلى أقل من 35 سنة: 227 د.أ\n" +
            "  - من 70 فما فوق: 377 د.أ",
          options: [
            { id: "sub_programs", title: "برامج المشتركين" },
            { id: "insurance_menu", title: "قائمة التأمين" },
            { id: "menu", title: "القائمة الرئيسية" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "details" },
          },
        });
      }
    }

    if (insuranceStep === "parents_shabab") {
      if (normalizedInput === "parents" || normalizedInput.includes("والد")) {
        return new InteractiveResponse({
          messageType: "interactive",
          body:
            "📋 تفاصيل برنامج بوليصة الوالدين:\n" +
            "برنامج مخصص لتغطية الآباء والأمهات (علاج داخل وخارج المستشفى).\n\n" +
            "* سقوف التغطية السنوية:\n" +
            "  - الدرجة الخاصة والأولى: 10,000 د.أ\n" +
            "  - الدرجة الثانية: 8,000 د.أ\n\n" +
            "* الأقساط السنوية (أمثلة للدرجة الأولى):\n" +
            "  - من 50 إلى أقل من 60 سنة: 487 د.أ\n" +
            "  - من 60 إلى أقل من 65 سنة: 567 د.أ\n" +
            "  - من 75 إلى أقل من 80 سنة: 702 د.أ",
          options: [
            { id: "parents_shabab", title: "الوالدين والشباب" },
            { id: "insurance_menu", title: "قائمة التأمين" },
            { id: "menu", title: "القائمة الرئيسية" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "details" },
          },
        });
      }

      if (normalizedInput === "shabab" || normalizedInput.includes("شباب")) {
        return new InteractiveResponse({
          messageType: "interactive",
          body:
            "📋 تفاصيل برامج المهندسين الشباب (تحت 30 سنة):\n" +
            "1. شباب 1 (درجة أولى - داخل وخارج المستشفى):\n" +
            "   - القسط السنوي: 140 د.أ.\n" +
            "2. شباب 2 (درجة أولى - داخل المستشفى فقط):\n" +
            "   - القسط السنوي: مجاني بالكامل للمهندسين خريجي 2025/2026.\n" +
            "3. شباب 3 (درجة أولى - داخل وخارج المستشفى ومراجعات الحمل):\n" +
            "   - القسط السنوي: 80 د.أ.",
          options: [
            { id: "parents_shabab", title: "الوالدين والشباب" },
            { id: "insurance_menu", title: "قائمة التأمين" },
            { id: "menu", title: "القائمة الرئيسية" },
          ],
          nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
          conversationUpdates: {
            metadata: { serviceTopic: "insurance", insuranceStep: "details" },
          },
        });
      }
    }

    // Default health menu fallback
    return new InteractiveResponse({
      messageType: "interactive",
      body: "عذراً، الرجاء النقر على أحد الأزرار المتاحة أدناه للتنقل:",
      options: [
        { id: "sub_programs", title: "برامج المشتركين" },
        { id: "parents_shabab", title: "الوالدين والشباب" },
        { id: "terms_docs", title: "الشروط والوثائق" },
      ],
      nextState: CONVERSATION_STATES.COLLECTING_SERVICE_DATA,
      conversationUpdates: {
        metadata: { serviceTopic: "insurance", insuranceStep: "menu" },
      },
    });
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
