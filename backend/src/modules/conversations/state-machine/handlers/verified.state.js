const { CONVERSATION_STATES } = require("../states.constants");
const { buildMainMenuText } = require("./main-menu.state");

/**
 * Transitional state after verification (usually skipped in favor of main_menu).
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleVerifiedState(context) {
  const memberName = context.conversation.memberName || "";

  return {
    replyText: buildMainMenuText(memberName),
    nextState: CONVERSATION_STATES.MAIN_MENU,
  };
}

module.exports = {
  handleVerifiedState,
};
