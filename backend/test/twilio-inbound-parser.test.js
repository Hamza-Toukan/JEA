const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseTwilioInboundMessage,
} = require("../src/modules/channels/whatsapp/twilio/twilio-inbound-parser");

describe("parseTwilioInboundMessage", () => {
  it("uses plain Body text when no interactive fields", () => {
    const result = parseTwilioInboundMessage({
      Body: "hello",
    });

    assert.equal(result.text, "hello");
    assert.equal(result.interactiveReply, null);
  });

  it("prefers ButtonPayload as effective text for quick replies", () => {
    const result = parseTwilioInboundMessage({
      Body: "Yes",
      ButtonPayload: "yes",
      ButtonText: "نعم",
    });

    assert.equal(result.text, "yes");
    assert.equal(result.interactiveReply.selectedId, "yes");
    assert.equal(result.interactiveReply.interactiveReplyType, "button_reply");
  });

  it("parses list reply from InteractiveData JSON", () => {
    const result = parseTwilioInboundMessage({
      Body: "",
      InteractiveData: JSON.stringify({
        list_reply: { id: "insurance", title: "التأمين" },
      }),
    });

    assert.equal(result.text, "insurance");
    assert.equal(result.interactiveReply.selectedId, "insurance");
    assert.equal(result.interactiveReply.interactiveReplyType, "list_reply");
  });
});
