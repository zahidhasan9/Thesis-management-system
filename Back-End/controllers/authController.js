const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const createToken = (id)=>{
 return jwt.sign({id},process.env.JWT_SECRET,{
  expiresIn:"7d"
 })
}

exports.register = async(req,res)=>{

 const {name,email,password,idNo,phone} = req.body

 const exist = await User.findOne({email})
 const Idexist = await User.findOne({idNo})

 if(exist){
 return res.status(404).json({ message: "User not found" });
 }
if(Idexist){
  return res.status(404).json({ message: "ID number exists" });
 }
 const hash = await bcrypt.hash(password,10)

 const user = await User.create({
  name,
  email,
  idNo,
  phone,
  password:hash
 })

 res.json(user)

}

exports.login = async(req,res)=>{

 const {email,password} = req.body

 const user = await User.findOne({email})

 if(!user){
  return res.status(404).json({ message: "User not found" });
 }

 const match = await bcrypt.compare(password,user.password)

 if(!match){
  return res.status(401).json({ message: "Wrong password" })
 }

 const token = createToken(user._id)

 res.cookie("token",token,{
  httpOnly:true,
  secure: false,
      domain: 'localhost',
      sameSite: 'lax',
 })

 res.json(user)

}

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // same as your login cookie
    domain: "localhost", // must match cookie domain
    sameSite: "lax",    // must match cookie SameSite
    path: "/",          // match path
  });

  res.status(200).json({ message: "Logged out successfully" });
};