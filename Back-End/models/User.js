const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

 name:String,

 email:{
  type:String,
  unique:true
 },

 phone:String,
 idNo:String,

 password:String,

 role:{
  type:String,
  enum:["student","supervisor","evaluator","admin,third_evaluator"],
  default:"student"
 },

 session:String

},{timestamps:true})

module.exports = mongoose.model("User",userSchema)