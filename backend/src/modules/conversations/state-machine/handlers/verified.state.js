const { CONVERSATION_STATES } = require("../states.constants");
const { buildMainMenuInteractiveResponse } = require("./main-menu.state");

/**
 * Transitional state after verification (usually skipped in favor of main_menu).
 * @param {import('../state-router').StateHandlerContext} context
 * @returns {import('../state-router').StateHandlerResult}
 */
function handleVerifiedState(context) {
  const memberName = context.conversation.memberName || "";

  return buildMainMenuInteractiveResponse(memberName);
}

module.exports = {
  handleVerifiedState,
};
