// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

// exports.protect = async (req,res,next)=>{

//  try{

//   const token = req.cookies.token

//   if(!token){
//    return res.status(401).json({message:"Not authorized"})
//   }

//   const decoded = jwt.verify(token,process.env.JWT_SECRET)

//   req.user = await User.findById(decoded.id)


//   next()

//  }catch(err){
//   res.status(401).json({message:"Token invalid"})
//  }

// }


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

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.status !== "active" || user.isActive !== true) {
      return res.status(403).json({
        message: "Account is not active",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Token invalid",
    });
  }
};