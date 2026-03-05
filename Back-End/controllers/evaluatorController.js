const Thesis = require("../models/Thesis")
const calculate = require("../utils/calculateFinalMark")

exports.getAccepted = async(req,res)=>{

 const thesis = await Thesis.find({
  status:"accepted"
 }).populate("student")

 res.json(thesis)

}

exports.giveMark = async(req,res)=>{

 const {thesisId,mark} = req.body

 const thesis = await Thesis.findById(thesisId)

 thesis.evaluatorMarks.push({
  evaluator:req.user._id,
  mark
 })

 const result = calculate(thesis.evaluatorMarks)

 thesis.finalMark = result

 await thesis.save()

 res.json(thesis)

}