const mongoose = require("mongoose")

const thesisSchema = new mongoose.Schema({

 title:String,

 student:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 pdf:String,

 status:{
  type:String,
  enum:["pending","accepted","declined"],
  default:"pending"
 },

 supervisorNote:String,

 evaluatorMarks:[
  {
   evaluator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   mark:Number
  }
 ],

 finalMark:Number

},{timestamps:true})

module.exports = mongoose.model("Thesis",thesisSchema)