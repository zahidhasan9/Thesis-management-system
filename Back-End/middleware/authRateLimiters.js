const { rateLimit } = require("express-rate-limit");

const createLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message },
  });

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

const registrationLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: "Too many registration attempts. Please try again later.",
});

const emailActionLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many email requests. Please try again after 15 minutes.",
});

const resetPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many password reset attempts. Please try again later.",
});

module.exports = {
  loginLimiter,
  registrationLimiter,
  emailActionLimiter,
  resetPasswordLimiter,
};
