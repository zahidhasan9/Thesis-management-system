// const User = require("../models/User")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")

// const createToken = (id)=>{
//  return jwt.sign({id},process.env.JWT_SECRET,{
//   expiresIn:"7d"
//  })
// }

// exports.register = async(req,res)=>{

//  const {name,email,password,idNo,phone} = req.body

//  const exist = await User.findOne({email})
//  const Idexist = await User.findOne({idNo})

//  if(exist){
//  return res.status(404).json({ message: "User not found" });
//  }
// if(Idexist){
//   return res.status(404).json({ message: "ID number exists" });
//  }
//  const hash = await bcrypt.hash(password,10)

//  const user = await User.create({
//   name,
//   email,
//   idNo,
//   phone,
//   password:hash
//  })

//  res.json(user)

// }

// exports.login = async(req,res)=>{

//  const {email,password} = req.body

//  const user = await User.findOne({email})

//  if(!user){
//   return res.status(404).json({ message: "User not found" });
//  }

//  const match = await bcrypt.compare(password,user.password)

//  if(!match){
//   return res.status(401).json({ message: "Wrong password" })
//  }

//  const token = createToken(user._id)

//  res.cookie("token",token,{
//   httpOnly:true,
//   secure: false,
//       domain: 'localhost',
//       sameSite: 'lax',
//  })

//  res.json(user)

// }

// exports.logout = async (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: false, // same as your login cookie
//     domain: "localhost", // must match cookie domain
//     sameSite: "lax",    // must match cookie SameSite
//     path: "/",          // match path
//   });

//   res.status(200).json({ message: "Logged out successfully" });
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, idNo, phone, department, batch, Section } =
      req.body;

    if (!name || !email || !password || !idNo) {
      return res.status(400).json({
        message: "Name, email, password and ID number are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exist = await User.findOne({ email: normalizedEmail });

    if (exist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const idExist = await User.findOne({ idNo });

    if (idExist) {
      return res.status(400).json({
        message: "ID number already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      idNo,
      phone,
      department,
      batch,
      Section,
      password: hash,
      role: "student",
      status: "pending",
      isActive: false,
      activatedAt: null,
      disabledAt: null,
      deleteAfter: new Date(Date.now() + FIFTEEN_DAYS),
    });

    const safeUser = await User.findById(user._id).select("-password");

    res.status(201).json({
      message:
        "Registration successful. Your account is pending admin approval.",
      user: safeUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    if (user.status !== "active" || user.isActive !== true) {
      return res.status(403).json({
        message:
          user.status === "disabled"
            ? "Your account has been disabled by admin."
            : "Your account is pending admin approval.",
        status: user.status,
      });
    }

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      domain: "localhost",
      sameSite: "lax",
      path: "/",
    });

    const safeUser = await User.findById(user._id).select("-password");

    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Login failed",
    });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    domain: "localhost",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};