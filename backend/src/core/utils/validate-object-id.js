const mongoose = require("mongoose");

/** Validates ObjectId syntax only. Does not check database existence. */
function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  validateObjectId,
};
