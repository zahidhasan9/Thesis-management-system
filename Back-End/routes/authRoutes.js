// const router = require("express").Router()

// const auth = require("../controllers/authController")

// router.post("/register",auth.register)

// router.post("/login",auth.login)

// router.post("/logout", auth.logout);

// module.exports = router

const router = require("express").Router();

const auth = require("../controllers/authController");
const {
  loginLimiter,
  registrationLimiter,
  emailActionLimiter,
  resetPasswordLimiter,
} = require("../middleware/authRateLimiters");

router.post("/register", registrationLimiter, auth.register);
router.post("/verify-email/:token", emailActionLimiter, auth.verifyEmail);
router.post(
  "/resend-verification",
  emailActionLimiter,
  auth.resendVerificationEmail,
);

router.post("/login", loginLimiter, auth.login);
router.post("/logout", auth.logout);

router.post("/forgot-password", emailActionLimiter, auth.forgotPassword);
router.post("/reset-password/:token", resetPasswordLimiter, auth.resetPassword);

module.exports = router;
