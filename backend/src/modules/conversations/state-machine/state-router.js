const { CONVERSATION_STATES } = require("./states.constants");
const { assertTransition } = require("./transition.service");
const { handleNewState } = require("./handlers/new.state");
const { handleVerificationState } = require("./handlers/verification.state");
const { handleVerifiedState } = require("./handlers/verified.state");
const {
  handleMainMenuState,
  handleCollectingServiceDataState,
  handleAwaitingAttachmentState,
  handleResolvedState,
} = require("./handlers/main-menu.state");
const { handleHandoffState } = require("./handlers/handoff.state");
const {
  applyConversationStateResult,
} = require("../conversation.service");
const { normalizeStateHandlerResult } = require("./handler-result.util");

/**
 * @typedef {Object} StateHandlerContext
 * @property {object} conversation - Mongoose conversation document
 * @property {string} text - Inbound message text
 * @property {object} inboundMessage - Persisted inbound message
 */

/**
 * @typedef {Object} StateHandlerResult
 * @property {string} replyText
 * @property {string} [nextState]
 * @property {Record<string, unknown>} [conversationUpdates]
 * @property {boolean} [setModeHuman]
 */

/**
 * @typedef {Object} NormalizedStateHandlerResult
 * @property {import('../../channels/whatsapp/contracts/interactive-response.contract').InteractiveResponse | null} interactiveResponse
 * @property {string} replyText
 * @property {string} [nextState]
 * @property {Record<string, unknown>} conversationUpdates
 * @property {boolean} setModeHuman
 * @property {Record<string, unknown>} metadata
 */

const handlersByState = {
  [CONVERSATION_STATES.NEW]: handleNewState,
  [CONVERSATION_STATES.AWAITING_VERIFICATION]: handleVerificationState,
  [CONVERSATION_STATES.VERIFIED]: handleVerifiedState,
  [CONVERSATION_STATES.MAIN_MENU]: handleMainMenuState,
  [CONVERSATION_STATES.COLLECTING_SERVICE_DATA]: handleCollectingServiceDataState,
  [CONVERSATION_STATES.AWAITING_ATTACHMENT]: handleAwaitingAttachmentState,
  [CONVERSATION_STATES.HUMAN_HANDOFF]: handleHandoffState,
  [CONVERSATION_STATES.RESOLVED]: handleResolvedState,
  [CONVERSATION_STATES.CLOSED]: handleResolvedState,
};

/**
 * Routes inbound text to the handler for the current conversationState.
 *
 * @param {StateHandlerContext} context
 * @returns {Promise<{ replyText: string, conversation: object, interactiveResponse: import('../../channels/whatsapp/contracts/interactive-response.contract').InteractiveResponse | null, handlerMetadata: Record<string, unknown> }>}
 */
function resolveConversationState(conversation) {
  if (conversation.conversationState) {
    return conversation.conversationState;
  }

  if (conversation.verifiedAt || conversation.engineeringId) {
    return CONVERSATION_STATES.MAIN_MENU;
  }

  if (conversation.memberId) {
    return CONVERSATION_STATES.MAIN_MENU;
  }

  return CONVERSATION_STATES.AWAITING_VERIFICATION;
}

async function routeConversationState(context) {
  const currentState = resolveConversationState(context.conversation);

  const handler = handlersByState[currentState];

  if (!handler) {
    const error = new Error(`No state handler for: ${currentState}`);
    error.code = "UNKNOWN_CONVERSATION_STATE";
    throw error;
  }

  const rawResult = handler(context);
  const result = normalizeStateHandlerResult(rawResult);

  const fromState = currentState;
  const toState = result.nextState || fromState;

  if (toState !== fromState) {
    assertTransition(fromState, toState);
  }

  const updatedConversation = await applyConversationStateResult({
    conversationId: context.conversation._id,
    fromState,
    toState,
    conversationUpdates: result.conversationUpdates || {},
    setModeHuman: result.setModeHuman,
  });

  return {
    replyText: result.replyText || "",
    interactiveResponse: result.interactiveResponse,
    handlerMetadata: result.metadata,
    conversation: updatedConversation || context.conversation,
  };
}

module.exports = {
  routeConversationState,
};
