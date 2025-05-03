const Subscription = require("../../models/Subscription.model");
const Transaction = require("../../models/Transaction.model");
const User = require("../../models/User.model");
const messages = require("../../utils/messages");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");
const stripe = require("../../utils/stripe");

const priceMap = {
  basic: {
    monthly: "price_1RKabiSDiSNQp2yKHIaTtF5V",
    yearly: "price_1RKacDSDiSNQp2yKatxLfV4B",
  },
  standard: {
    monthly: "price_1RKacqSDiSNQp2yKgmRVDWYE",
    yearly: "price_1RKacqSDiSNQp2yKP1fukOyQ",
  },
  premium: {
    monthly: "price_1RKadoSDiSNQp2yKOSPaEj7v",
    yearly: "price_1RKadoSDiSNQp2yKaxncp0Zr",
  },
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

const createCheckoutSession = async (req, res) => {
  try {
    const { email, plan, interval } = req.body;

    const existingUser = await User.findOne({ email }).lean();
    const customer = existingUser?.stripeCustomerId
      ? { id: existingUser.successResponse }
      : stripe.customers.create({ email });

    const priceId = priceMap[plan][interval];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    if (!existingUser) {
      await User.create({
        email,
        stripeCustomerId: customer.id,
        plan: plan,
        interval: interval,
      });
    } else {
      await User.findOneAndUpdate(
        {
          _id: req.user._od,
        },
        {
          $set: {
            stripeCustomerId: customer.id,
            plan: plan,
            interval: interval,
          },
        }
      );
    }
    return successResponse(res, { url: session.url });
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const stripeSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer"],
    });

    if (!session.subscription || !session.customer) {
      return res.redirect(
        302,
        `/user/subscription/success?session_id=${session_id}`
      );
    }

    const subscription = session.subscription;
    const customer = session.customer;

    await User.findOneAndUpdate(
      {
        stripeCustomerId: customer.id,
      },
      {
        $set: {
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
        },
      }
    );

    return successResponse(res, [], "Subscription successful");
  } catch (error) {
    console.log("error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, webHookSecret);
    const { type, data } = event;

    switch (type) {
      case "payment_intent.succeeded":
        const paymentIntent = data.object;
        const paymentIntentId = paymentIntent.id;
        const amountReceived = paymentIntent.amount;
        const currency = paymentIntent.currency;
        const customerId = paymentIntent.customer;

        const customer = await stripe.customer.retrieve(customerId);
        const user = await User.findOne({ stripeCustomerId: customer.id });

        if (user) {
          await Transaction.create({
            userId: user._id,
            sessionId: paymentIntentId,
            amount: amountReceived / 100,
            currency,
            paymentIntentId: paymentIntentId,
          });
        }
        break;

      case "invoice.payment_failed":
        const failedInvoice = data.object;
        await User.findOneAndUpdate(
          {
            stripeCustomerId: failedInvoice.customer,
          },
          { $set: { subscriptionStatus: "past_due" } }
        );
        break;

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    return successResponse(res, "Webhook handled successfully");
  } catch (err) {
    return errorResponse(res, `Webhook Error: ${err.message}`);
  }
};

module.exports = {
  getAllSubscriptions,
  createCheckoutSession,
  stripeSuccess,
  stripeWebhook,
};
