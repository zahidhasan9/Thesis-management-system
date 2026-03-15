exports.allowRoles = (...roles)=>{

 return (req,res,next)=>{

  if(!roles.includes(req.user.role)){
    console.log("Role check passed for user:", req.user._id, "with role:", req.user.role);
   return res.status(403).json({
    message:"Access denied"
   })
  }

  next()

 }

}