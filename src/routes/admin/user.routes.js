const router = require("express").Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../controllers/admin/user.controller");
const { verifyToken, verifyAdmin } = require("../../middlewares/jwt");

router.post("/add", verifyToken, verifyAdmin, createUser);
router.get("/all", verifyToken, verifyAdmin, getAllUsers);
router.get("/details/:userId", verifyAdmin, verifyToken, getUserById);
router.put("/update/:userId", verifyToken, verifyAdmin, updateUser);
router.delete("/delete/:userId", verifyToken, verifyAdmin, deleteUser);

module.exports = router;
