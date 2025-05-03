const Subscription = require("../../models/Subscription.model");
const messages = require("../../utils/messages");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");

const seedSubscriptions = async (req, res) => {
  try {
    const subscriptions = [
      {
        name: "Basic",
        price: { monthly: 10, yearly: 100 },
        rateLimitPerMinute: 10,
        allowedAPIs: ["STOCK_API_1"],
      },
      {
        name: "Standard",
        price: { monthly: 20, yearly: 220 },
        rateLimitPerMinute: 50,
        allowedAPIs: ["STOCK_API_1", "STOCK_API_2"],
      },
      {
        name: "Premium",
        price: { monthly: 30, yearly: 330 },
        rateLimitPerMinute: null,
        allowedAPIs: ["STOCK_API_1", "STOCK_API_2", "STOCK_API_3"],
      },
    ];

    for (const plan of subscriptions) {
      await Subscription.updateOne(
        { name: plan.name },
        { $set: plan },
        { upsert: true }
      );
    }

    const plans = await Subscription.find().lean();
    return successResponse(
      res,
      plans,
      "Subscriptions list fetched successfully."
    );
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const result = await Subscription.find().lean();
    return successResponse(
      res,
      result,
      "All Subscriptions list fetched successfully."
    );
  } catch (error) {
    console.log("error", error);
    return errorResponse(res, messages.ERROR);
  }
};

module.exports = { seedSubscriptions, getAllSubscriptions };
