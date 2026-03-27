const mongoose = require("mongoose")

const thesisSchema = new mongoose.Schema({

 title:String,

 student:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },
 supervisor:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 pdf:String,

 status:{
  type:String,
  enum:["pending","accepted","declined","completed"],
  default:"pending"
 },

 supervisorNote:String,

  evaluators:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 }],

 evaluatorMarks:[
  {
   evaluator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   mark:Number
  }
 ],

  // Third evaluator mark (optional)
 thirdEvaluatorMark: {
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mark: Number
 },
 description:String,

 // Final mark after calculation
//  finalMark: { type: Number, default: null }
 finalMark:Number

},{timestamps:true})

module.exports = mongoose.model("Thesis",thesisSchema)