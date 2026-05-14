const mongoose = require("mongoose")

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
const userSchema = new mongoose.Schema({

 name:String,

 email:{
  type:String,
  unique:true
 },

 phone:String,
 idNo:String,
 department: { type: String },
 batch:String,
 Section:String,
 position:String, // For supervisors: Professor, Associate Professor, etc.
 password:String,
 bio:String ,

 role:{
  type:String,
  enum:["student","supervisor","evaluator","admin","third_evaluator"],
  default:"student"
 },

 session:String,

 status: {
  type: String,
  enum: ["pending", "active", "disabled"],
  default: "pending",
},

isActive: {
  type: Boolean,
  default: false,
},

activatedAt: {
  type: Date,
},

disabledAt: {
  type: Date,
},

deleteAfter: {
      type: Date,
      default: function () {
        return new Date(Date.now() + FIFTEEN_DAYS);
                          }
},

},{timestamps:true})

module.exports = mongoose.model("User",userSchema)