const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: String,
    amount: Number,
    status: String,
    currency: String,
    paymentIntentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
