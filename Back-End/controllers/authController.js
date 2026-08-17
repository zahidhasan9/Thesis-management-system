const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");
const {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../utils/emailTemplates");

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
const EMAIL_VERIFICATION_LIFETIME = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_LIFETIME = 15 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;

const normalizeEmail = (email = "") => email.toLowerCase().trim();

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createSecureToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return {
    token,
    hashedToken: hashToken(token),
  };
};

const createLoginToken = (user) =>
  jwt.sign({ id: user._id, tv: user.tokenVersion || 0 }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const getClientUrl = () =>
  (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongEnoughPassword = (password) =>
  typeof password === "string" && password.length >= 8;

const buildVerificationEmail = (user, rawToken) => {
  const verificationUrl = `${getClientUrl()}/verify-email/${rawToken}`;
  return verificationEmailTemplate({
    name: user.name || "User",
    verificationUrl,
  });
};

const buildResetEmail = (user, rawToken) => {
  const resetUrl = `${getClientUrl()}/reset-password/${rawToken}`;
  return resetPasswordEmailTemplate({
    name: user.name || "User",
    resetUrl,
  });
};

exports.register = async (req, res) => {
  let createdUserId = null;

  try {
    const { name, email, password, idNo, phone, department, batch, Section,
      position, accountType = "student" } = req.body;

    if (!name || !email || !password || !idNo || !phone) {
      return res.status(400).json({
        message: "Name, email, password, ID number and phone are required",
      });
    }

    if (!["student", "teacher"].includes(accountType)) {
      return res.status(400).json({ message: "Invalid account type" });
    }

    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    if (accountType === "teacher" && !position) {
      return res.status(400).json({
        message: "Designation is required for teachers",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!isStrongEnoughPassword(password)) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    const [existingEmail, existingId] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ idNo: String(idNo).trim() }),
    ]);

    if (existingEmail) {
      return res.status(400).json({
        message:
          existingEmail.isEmailVerified === false
            ? "Email already registered but not verified. Please resend the verification email."
            : "Email already exists",
        code:
          existingEmail.isEmailVerified === false
            ? "EMAIL_NOT_VERIFIED"
            : "EMAIL_EXISTS",
      });
    }

    if (existingId) {
      return res.status(400).json({
        message: "ID number already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { token, hashedToken } = createSecureToken();

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      idNo: String(idNo).trim(),
      phone: String(phone).trim(),
      department,
      batch,
      Section,
      position: accountType === "teacher" ? String(position).trim() : undefined,
      password: passwordHash,
      role: accountType === "teacher" ? "supervisor" : "student",
      status: "pending",
      isActive: false,
      activatedAt: null,
      disabledAt: null,
      deleteAfter: new Date(Date.now() + FIFTEEN_DAYS),

      isEmailVerified: false,
      emailVerifiedAt: null,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(
        Date.now() + EMAIL_VERIFICATION_LIFETIME,
      ),
      lastVerificationEmailSentAt: new Date(),
    });

    createdUserId = user._id;

    const emailContent = buildVerificationEmail(user, token);

    await sendEmail({
      to: user.email,
      ...emailContent,
    });

    const safeUser = await User.findById(user._id);

    return res.status(201).json({
      message:
        "Registration successful. We sent a verification link to your email.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Registration error:", error);

    /*
     * If the first verification email could not be sent, remove the newly
     * created account so the student can register again after SMTP is fixed.
     */
    if (createdUserId) {
      await User.findByIdAndDelete(createdUserId).catch(() => undefined);
    }

    return res.status(500).json({
      message:
        "Registration could not be completed because the verification email was not sent.",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() },
      isEmailVerified: false,
    }).select(
      "+emailVerificationToken +emailVerificationExpires +lastVerificationEmailSentAt",
    );

    if (!user) {
      return res.status(400).json({
        message:
          "The verification link is invalid or has expired. Please request a new link.",
        code: "INVALID_OR_EXPIRED_TOKEN",
      });
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.lastVerificationEmailSentAt = undefined;

    await user.save();

    return res.status(200).json({
      message:
        user.status === "active" && user.isActive === true
          ? "Email verified successfully. You can now log in."
          : "Email verified successfully. Your account is now waiting for admin approval.",
      status: user.status,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      message: "Email verification failed",
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+emailVerificationToken +emailVerificationExpires +lastVerificationEmailSentAt",
    );

    /*
     * Generic response protects against checking which email addresses
     * are registered.
     */
    const genericMessage =
      "If this email belongs to an unverified account, a new verification link has been sent.";

    if (!user || user.isEmailVerified !== false) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    const lastSent = user.lastVerificationEmailSentAt?.getTime() || 0;
    const remainingTime = RESEND_COOLDOWN - (Date.now() - lastSent);

    if (remainingTime > 0) {
      return res.status(429).json({
        message: `Please wait ${Math.ceil(
          remainingTime / 1000,
        )} seconds before requesting another email.`,
      });
    }

    const previousToken = user.emailVerificationToken;
    const previousExpires = user.emailVerificationExpires;
    const previousSentAt = user.lastVerificationEmailSentAt;

    const { token, hashedToken } = createSecureToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(
      Date.now() + EMAIL_VERIFICATION_LIFETIME,
    );
    user.lastVerificationEmailSentAt = new Date();

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        ...buildVerificationEmail(user, token),
      });
    } catch (emailError) {
      user.emailVerificationToken = previousToken;
      user.emailVerificationExpires = previousExpires;
      user.lastVerificationEmailSentAt = previousSentAt;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Verification email could not be sent",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +tokenVersion");

    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    /*
     * Only users explicitly marked false are blocked. This keeps existing
     * users (created before this feature) working without a migration.
     */
    if (user.isEmailVerified === false) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
    }

    if (user.status !== "active" || user.isActive !== true) {
      return res.status(403).json({
        message:
          user.status === "disabled"
            ? "Your account has been disabled by admin."
            : "Your email is verified, but your account is pending admin approval.",
        status: user.status,
        code:
          user.status === "disabled"
            ? "ACCOUNT_DISABLED"
            : "ADMIN_APPROVAL_PENDING",
      });
    }

    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    user.lastLoginUserAgent = String(req.get("user-agent") || "").slice(0, 500);
    await user.save();

    const token = createLoginToken(user);
    res.cookie("token", token, getCookieOptions());

    const safeUser = await User.findById(user._id);

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const genericMessage =
      "If an account exists for this email, a password reset link has been sent.";

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    const previousToken = user.passwordResetToken;
    const previousExpires = user.passwordResetExpires;
    const { token, hashedToken } = createSecureToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_LIFETIME);

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        ...buildResetEmail(user, token),
      });
    } catch (emailError) {
      user.passwordResetToken = previousToken;
      user.passwordResetExpires = previousExpires;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Password reset email could not be sent",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    if (!isStrongEnoughPassword(password)) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    }).select("+password +passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        message:
          "The password reset link is invalid or has expired. Please request a new link.",
        code: "INVALID_OR_EXPIRED_TOKEN",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordChangedAt = new Date();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.clearCookie("token", {
      ...getCookieOptions(),
      maxAge: undefined,
    });

    return res.status(200).json({
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Password reset failed",
    });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    ...getCookieOptions(),
    maxAge: undefined,
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

exports.logoutAll = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    res.clearCookie("token", {
      ...getCookieOptions(),
      maxAge: undefined,
    });
    return res.json({ message: "Logged out from all devices" });
  } catch (error) {
    return res.status(500).json({ message: "Could not end all sessions" });
  }
};
