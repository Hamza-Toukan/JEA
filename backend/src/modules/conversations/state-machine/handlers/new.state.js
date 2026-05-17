const { CONVERSATION_STATES } = require("../states.constants");

/**
 * @param {import('../state-router').StateHandlerContext} _context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleNewState(_context) {
  return {
    replyText:
      "أهلًا بك في المساعد الرقمي لنقابة المهندسين الأردنيين.\n\n" +
      "للمتابعة، يرجى إرسال رقم العضوية الهندسية (مثال: 100001).",
    nextState: CONVERSATION_STATES.AWAITING_VERIFICATION,
    conversationUpdates: {
      ticketStatus: "open",
    },
  };
}

module.exports = {
  handleNewState,
};
