const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    customerPhone: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    memberId: {
      type: String,
      default: null,
      index: true
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true
    },

    mode: {
      type: String,
      enum: ["bot", "human"],
      default: "bot",
      index: true
    },

    lastMessageText: {
      type: String,
      default: ""
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    tags: {
      type: [String],
      default: []
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

conversationSchema.index({ customerPhone: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = {
  Conversation
};