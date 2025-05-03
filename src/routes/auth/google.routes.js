const router = require("express").Router();
const GoogleController = require("../../controllers/auth/google.controller");

router.get("/login", GoogleController.googleLogin);
router.get("/callback", GoogleController.googleCallback);

module.exports = router;
