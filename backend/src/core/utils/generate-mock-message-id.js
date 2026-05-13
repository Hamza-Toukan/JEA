const crypto = require("crypto");

function generateMockMessageId() {
  if (typeof crypto.randomUUID === "function") {
    return `mock_out_${crypto.randomUUID()}`;
  }

  return `mock_out_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

module.exports = {
  generateMockMessageId,
};
