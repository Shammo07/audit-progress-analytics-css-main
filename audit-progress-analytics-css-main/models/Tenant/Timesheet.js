const mongoose = require("mongoose");

const timeSheetSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  chargeableToClient: [
    {
      clientName: String,
      pic: String,
      code: String,
      error: String,
      hoursSpent: [{ type: Number }],
    },
  ],
  adminForCompany: [
    {
      itemName: String,
      error: String,
      hoursSpent: [{ type: Number }],
    },
  ],
  study: [
    {
      itemName: String,
      error: String,
      hoursSpent: [{ type: Number }],
    },
  ],
});

module.exports = timeSheetSchema;
