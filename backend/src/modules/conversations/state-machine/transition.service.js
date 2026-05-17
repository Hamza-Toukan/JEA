const {
  ALLOWED_TRANSITIONS,
  ALL_CONVERSATION_STATES,
} = require("./states.constants");

function canTransition(fromState, toState) {
  if (!ALL_CONVERSATION_STATES.includes(toState)) {
    return false;
  }

  const allowed = ALLOWED_TRANSITIONS[fromState];

  if (!allowed) {
    return false;
  }

  return allowed.includes(toState);
}

/**
 * @param {string} fromState
 * @param {string} toState
 * @throws {Error} when transition is not allowed
 */
function assertTransition(fromState, toState) {
  if (!canTransition(fromState, toState)) {
    const error = new Error(
      `Invalid conversation state transition: ${fromState} → ${toState}`
    );
    error.code = "INVALID_STATE_TRANSITION";
    throw error;
  }
}

module.exports = {
  canTransition,
  assertTransition,
};
