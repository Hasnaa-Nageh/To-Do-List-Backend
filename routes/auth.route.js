const express = require("express");
const {
  signup,
  login,
  logOut,
  changePassword,
  refreshToken,
} = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const {
  signupValidation,
  loginValidation,
  changePasswordValidation,
} = require("../validation/user.validation");
const validate = require("../middleware/validate.middleware");
const router = express.Router();

router.post("/signup", validate(signupValidation), signup);
router.post("/login", validate(loginValidation), login);
router.post(
  "/change-password",
  authenticateToken,
  validate(changePasswordValidation),
  changePassword
);

router.post("/refresh-token", refreshToken);
router.post("/logout", logOut);
module.exports = router;
