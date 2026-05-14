const mongoose = require("mongoose");

const internalNoteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    customerPhone: {
      type: String,
      required: true,
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

    ticketNumber: {
      type: String,
      trim: true,
      default: null,
      sparse: true,
      unique: true,
    },

    ticketStatus: {
      type: String,
      enum: ["new", "open", "pending", "resolved", "closed"],
      default: "new",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    internalNotes: {
      type: [internalNoteSchema],
      default: [],
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

conversationSchema.index(
  { customerPhone: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "open" },
  }
);
conversationSchema.index({ customerPhone: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.pre("save", async function assignTicketNumberIfNew() {
  if (!this.isNew || this.ticketNumber) {
    return;
  }
  const { allocateTicketNumber } = require("./ticket-number.util");
  this.ticketNumber = await allocateTicketNumber();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = {
  Conversation
};