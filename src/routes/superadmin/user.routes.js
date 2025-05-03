const router = require("express").Router();
const {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
} = require("../../controllers/superadmin/user.controller");
const { verifyToken, verifySuperAdmin } = require("../../middlewares/jwt");

router.post("/add", verifyToken, verifySuperAdmin, createAdminUser);
router.get("/all", verifyToken, verifySuperAdmin, getAllAdminUsers);
router.get("/details/:userId", verifySuperAdmin, verifyToken, getAdminUserById);
router.put("/update/:userId", verifyToken, verifySuperAdmin, updateAdminUser);
router.delete(
  "/delete/:userId",
  verifyToken,
  verifySuperAdmin,
  deleteAdminUser
);

module.exports = router;
