const { TicketCounter } = require("./ticket-counter.model");

function formatYYYYMMDD(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * Allocates the next ticket number for the current UTC calendar day.
 * Format: JEA-YYYYMMDD-XXXX (XXXX = zero-padded daily sequence).
 */
async function allocateTicketNumber() {
  const date = formatYYYYMMDD();
  const counter = await TicketCounter.findOneAndUpdate(
    { date },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `JEA-${date}-${String(counter.seq).padStart(4, "0")}`;
}

module.exports = {
  allocateTicketNumber,
  formatYYYYMMDD,
};
