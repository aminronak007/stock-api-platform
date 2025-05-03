const router = require("express").Router();
const {
  githubLogin,
  githubCallback,
} = require("../../controllers/auth/github.controller");

router.get("/login", githubLogin);
router.get("/callback", githubCallback);

module.exports = router;
