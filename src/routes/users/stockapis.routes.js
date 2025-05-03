const router = require("express").Router();
const {
  getAccessToStockApi,
  stockAPI,
} = require("../../controllers/users/stockapi.controller");
const { verifyToken } = require("../../middlewares/jwt");

router.get("/all", verifyToken, getAccessToStockApi);
router.get("/details", verifyToken, stockAPI);

module.exports = router;
