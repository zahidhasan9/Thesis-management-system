// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         message: "Not authorized",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         message: "User not found",
//       });
//     }

//     if (user.status !== "active" || user.isActive !== true) {
//       return res.status(403).json({
//         message: "Account is not active",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       message: "Token invalid",
//     });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("+passwordChangedAt");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified === false) {
      return res.status(403).json({
        message: "Email is not verified",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    if (user.status !== "active" || user.isActive !== true) {
      return res.status(403).json({
        message: "Account is not active",
      });
    }

    if (
      user.passwordChangedAt &&
      Math.floor(user.passwordChangedAt.getTime() / 1000) > decoded.iat
    ) {
      return res.status(401).json({
        message: "Password was changed. Please log in again.",
      });
    }

    user.passwordChangedAt = undefined;
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid",
    });
  }
};
