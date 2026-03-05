const User = require("../models/User")

exports.getUsers = async(req,res)=>{

 const users = await User.find()

 res.json(users)

}

exports.changeRole = async(req,res)=>{

 const {userId,role} = req.body

 if(role==="evaluator"){

  const count = await User.countDocuments({
   role:"evaluator"
  })

  if(count>=3){
   return res.json({
    message:"Only 3 evaluators allowed"
   })
  }

 }

 const user = await User.findByIdAndUpdate(
  userId,
  {role},
  {new:true}
 )

 res.json(user)

}

exports.deleteUser = async(req,res)=>{

 const {id} = req.params

 await User.findByIdAndDelete(id)

 res.json({message:"User deleted"})

}