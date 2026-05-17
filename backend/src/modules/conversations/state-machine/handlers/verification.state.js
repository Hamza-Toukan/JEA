const { CONVERSATION_STATES } = require("../states.constants");
const {
  verifyMemberByEngineeringId,
} = require("../../../members/services/mock-member.service");

/**
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleVerificationState(context) {
  const engineeringId = (context.text || "").trim();

  if (!engineeringId) {
    return {
      replyText:
        "يرجى إرسال رقم العضوية الهندسية (أرقام فقط، مثال: 100001).",
      nextState: CONVERSATION_STATES.AWAITING_VERIFICATION,
    };
  }

  const result = verifyMemberByEngineeringId(engineeringId);

  if (!result.found) {
    return {
      replyText:
        "لم يتم العثور على رقم العضوية. يرجى التحقق من الرقم وإعادة الإرسال.\n" +
        "للتجربة: 100001 أو 100002 (أعضاء فعّالون).",
      nextState: CONVERSATION_STATES.AWAITING_VERIFICATION,
    };
  }

  if (!result.active) {
    return {
      replyText:
        "عضويتك غير فعّالة حاليًا. يرجى التواصل مع نقابة المهندسين، " +
        "أو أعد إرسال رقم عضوية آخر إن كان هناك خطأ.",
      nextState: CONVERSATION_STATES.AWAITING_VERIFICATION,
    };
  }

  const { member } = result;

  return {
    replyText:
      `مرحبًا ${member.memberName} (${member.memberSpecialty}).\n\n` +
      "تم التحقق من عضويتك بنجاح.\n\n" +
      "اختر من القائمة:\n" +
      "1 — التأمين الصحي\n" +
      "2 — العضوية والاشتراكات\n" +
      "3 — التحدث مع موظف\n" +
      "4 — خدمات أخرى",
    nextState: CONVERSATION_STATES.MAIN_MENU,
    conversationUpdates: {
      engineeringId: member.engineeringId,
      memberId: member.engineeringId,
      memberName: member.memberName,
      memberSpecialty: member.memberSpecialty,
      membershipStatus: member.membershipStatus,
      verifiedAt: new Date(),
    },
  };
}

module.exports = {
  handleVerificationState,
};
