const Thesis = require("../models/Thesis")

// exports.getAllThesis = async(req,res)=>{

//  const thesis = await Thesis.find()
//  .populate("student")

//  res.json(thesis)

// }

exports.getAllThesis = async(req,res)=>{

 try{

  const thesis = await Thesis.find()
  .populate("student")

  res.json(thesis)

 }catch(err){
 console.error(err)
  res.status(500).json({message:"Server error"})

 }

}
exports.reviewThesis = async(req,res)=>{

 const {thesisId,status,note} = req.body

 const thesis = await Thesis.findByIdAndUpdate(

  thesisId,

  {
   status,
   supervisorNote:note
  },

  {new:true}

 )

 res.json(thesis)

}