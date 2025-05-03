const express = require("express");
const router = require("express").Router();
const {
  getAllSubscriptions,
  createCheckoutSession,
  stripeSuccess,
  stripeWebhook,
} = require("../../controllers/users/subscription.controller");
const { verifyToken } = require("../../middlewares/jwt");

router.get("/all", verifyToken, getAllSubscriptions);
router.post("/checkout", verifyToken, createCheckoutSession);
router.get("/success", stripeSuccess);
router.get(
  "/success",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
