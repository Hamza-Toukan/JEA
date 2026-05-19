const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  canTransition,
  assertTransition,
} = require("../src/modules/conversations/state-machine/transition.service");
const {
  CONVERSATION_STATES,
} = require("../src/modules/conversations/state-machine/states.constants");

describe("transition.service", () => {
  it("allows new → awaiting_verification", () => {
    assert.equal(
      canTransition(
        CONVERSATION_STATES.NEW,
        CONVERSATION_STATES.AWAITING_VERIFICATION
      ),
      true
    );
  });

  it("denies new → main_menu", () => {
    assert.equal(
      canTransition(CONVERSATION_STATES.NEW, CONVERSATION_STATES.MAIN_MENU),
      false
    );
  });

  it("assertTransition throws on invalid edge", () => {
    assert.throws(
      () =>
        assertTransition(
          CONVERSATION_STATES.NEW,
          CONVERSATION_STATES.HUMAN_HANDOFF
        ),
      (error) => error.code === "INVALID_STATE_TRANSITION"
    );
  });
});
