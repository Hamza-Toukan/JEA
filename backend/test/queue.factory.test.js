const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  buildProviderMessageJobId,
} = require("../src/core/queue/queue.factory");
const { QUEUE_NAMES } = require("../src/core/queue/queue.constants");

describe("queue.factory", () => {
  it("builds stable BullMQ job id from provider message id", () => {
    assert.equal(
      buildProviderMessageJobId("twilio", "SM123456"),
      "twilio-SM123456"
    );
  });

  it("defines expected queue names", () => {
    assert.equal(
      QUEUE_NAMES.INBOUND_MESSAGE_PROCESSING,
      "inbound-message-processing"
    );
    assert.equal(QUEUE_NAMES.OUTBOUND_RETRY, "outbound-retry");
  });
});
