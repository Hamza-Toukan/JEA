const {
  InteractiveResponse,
} = require("../../channels/whatsapp/contracts/interactive-response.contract");

/**
 * Normalizes legacy handler results and InteractiveResponse instances.
 *
 * @param {import('./state-router').StateHandlerResult | InteractiveResponse} result
 * @returns {import('./state-router').NormalizedStateHandlerResult}
 */
function normalizeStateHandlerResult(result) {
  if (result instanceof InteractiveResponse) {
    return {
      interactiveResponse: result,
      replyText: result.body,
      nextState: result.nextState,
      conversationUpdates: result.conversationUpdates || {},
      setModeHuman: Boolean(result.setModeHuman),
      metadata: result.metadata || {},
    };
  }

  return {
    interactiveResponse: null,
    replyText: result.replyText || "",
    nextState: result.nextState,
    conversationUpdates: result.conversationUpdates || {},
    setModeHuman: Boolean(result.setModeHuman),
    metadata: {},
  };
}

module.exports = {
  normalizeStateHandlerResult,
};
