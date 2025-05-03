const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      required: true,
    },
    price: {
      monthly: { type: Number, required: true },
      yearly: { type: Number, required: true },
    },
    validity: {
      type: String,
      enum: ["monthly", "yearly"],
    },
    rateLimitPerMinute: {
      type: Number,
      required: true,
    },
    allowedAPIs: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
