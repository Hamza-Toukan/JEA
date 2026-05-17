const { CONVERSATION_STATES } = require("../states.constants");

/**
 * @param {import('../state-router').StateHandlerContext} _context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleHandoffState(_context) {
  return {
    replyText:
      "محادثتك لدى فريق الدعم البشري. يرجى انتظار رد الموظف. " +
      "لن يردّ البوت تلقائيًا حتى يتم إعادة تفعيل وضع الآلي من قبل الموظف.",
    nextState: CONVERSATION_STATES.HUMAN_HANDOFF,
    setModeHuman: true,
  };
}

module.exports = {
  handleHandoffState,
};
