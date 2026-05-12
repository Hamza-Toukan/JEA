const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
      index: true
    },

    senderType: {
      type: String,
      enum: ["customer", "bot", "agent", "system"],
      required: true,
      index: true
    },

    text: {
      type: String,
      default: ""
    },

    provider: {
      type: String,
      enum: ["mock", "meta", "twilio"],
      default: "mock",
      index: true
    },

    providerMessageId: {
      type: String,
      default: null,
      index: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "interactive", "system"],
      default: "text"
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    correlationInboundMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index(
  { provider: 1, providerMessageId: 1 },
  {
    unique: true,
    sparse: true
  }
);

messageSchema.index(
  { correlationInboundMessageId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      correlationInboundMessageId: { $exists: true, $ne: null },
    },
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Message
};