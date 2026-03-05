const mongoose = require("mongoose")

const evaluationSchema = new mongoose.Schema({

 thesis:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Thesis"
 },

 evaluator:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 mark:Number,

 feedback:String

},{timestamps:true})

module.exports = mongoose.model("Evaluation",evaluationSchema)