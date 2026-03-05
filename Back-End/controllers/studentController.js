const Thesis = require("../models/Thesis")

exports.uploadThesis = async(req,res)=>{

 const thesis = await Thesis.create({

  student:req.user._id,

  title:req.body.title,

  pdf:req.file.path

 })

 res.json(thesis)

}

exports.myThesis = async(req,res)=>{

 const thesis = await Thesis.find({
  student:req.user._id
 })

 res.json(thesis)

}

exports.deleteThesis = async(req,res)=>{

 const thesis = await Thesis.findById(req.params.id)

 if(thesis.status==="accepted"){
  return res.json({
   message:"Cannot delete accepted thesis"
  })
 }

 await Thesis.findByIdAndDelete(req.params.id)

 res.json({message:"Deleted"})

}