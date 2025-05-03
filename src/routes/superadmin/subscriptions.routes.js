const router = require("express").Router();
const {
  seedSubscriptions,
  getAllSubscriptions,
} = require("../../controllers/superadmin/subscription.controller");
const { verifyToken, verifySuperAdmin } = require("../../middlewares/jwt");

router.post("/add", verifyToken, verifySuperAdmin, seedSubscriptions);
router.get("/all", verifyToken, verifySuperAdmin, getAllSubscriptions);

module.exports = router;
