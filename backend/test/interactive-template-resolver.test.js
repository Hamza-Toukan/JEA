const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  resolveInteractiveTemplate,
} = require("../src/modules/channels/whatsapp/templates/interactive-template-resolver.service");

describe("interactive-template-resolver", () => {
  it("resolves supported quick reply counts", () => {
    assert.equal(
      resolveInteractiveTemplate({ type: "quick_reply", optionCount: 2 }),
      "quick_reply_2"
    );
    assert.equal(
      resolveInteractiveTemplate({ type: "quick_reply", optionCount: 3 }),
      "quick_reply_3"
    );
  });

  it("returns null for unsupported quick reply counts", () => {
    assert.equal(
      resolveInteractiveTemplate({ type: "quick_reply", optionCount: 1 }),
      null
    );
  });

  it("resolves list_4 only for supported list size", () => {
    assert.equal(
      resolveInteractiveTemplate({ type: "list", optionCount: 4 }),
      "list_4"
    );
    assert.equal(
      resolveInteractiveTemplate({ type: "list", optionCount: 6 }),
      null
    );
  });
});
