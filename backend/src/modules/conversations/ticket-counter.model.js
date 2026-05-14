const mongoose = require("mongoose");

const ticketCounterSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      match: /^\d{8}$/,
      index: true,
      unique: true,
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: false }
);

const TicketCounter = mongoose.model("TicketCounter", ticketCounterSchema);

module.exports = { TicketCounter };
