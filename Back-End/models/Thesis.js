const mongoose = require("mongoose")

const thesisSchema = new mongoose.Schema({

 projectId:{
  type:String,
  trim:true,
  unique:true,
  sparse:true
 },
 academicSession:{type:String,trim:true},
 sessionSerial:{type:Number,min:1},

 title:String,
 aiScore:{type:Number,min:0,validate:{validator:(value)=>value<25,message:"AI score must be less than 25%"}},
 plagiarismScore:{type:Number,min:0,validate:{validator:(value)=>value<25,message:"Plagiarism score must be less than 25%"}},
 aiCheckUrl:{type:String,trim:true},
 plagiarismCheckUrl:{type:String,trim:true},
 aiReportPdf:{type:String,trim:true},
 plagiarismReportPdf:{type:String,trim:true},

 student:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },
 supervisor:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },
 supervisorRequest:{
  status:{type:String,enum:["unassigned","pending","accepted","rejected","reassigned"],default:"unassigned"},
  respondedAt:Date,
  rejectionReason:{type:String,trim:true},
  note:{type:String,trim:true},
  deadline:Date,
  reminderSentAt:Date,
  emailDelivery:{
   status:{type:String,enum:["not_sent","pending","sent","failed"],default:"not_sent"},
   sentAt:Date,
   error:String
  }
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

 evaluatorAssignments:[{
  evaluator:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  position:{type:Number,enum:[1,2,3],required:true},
  status:{type:String,enum:["awaiting_supervisor","pending","accepted","rejected","reassigned","evaluation_pending","mark_submitted","completed"],default:"awaiting_supervisor"},
  respondedAt:Date,
  rejectionReason:{type:String,trim:true},
  note:{type:String,trim:true},
  mark:{type:Number,min:0,max:100,default:null},
  feedback:{type:String,trim:true},
  recommendation:{type:String,trim:true},
  rubric:{
   researchQuality:{type:Number,min:0,max:20},
   methodology:{type:Number,min:0,max:20},
   implementation:{type:Number,min:0,max:20},
   reportQuality:{type:Number,min:0,max:20},
   presentation:{type:Number,min:0,max:20}
  },
  submittedAt:Date,
  deadline:Date,
  reminderSentAt:Date,
  markLocked:{type:Boolean,default:false},
  markHistory:[{
   previousMark:Number,
   newMark:Number,
   changedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
   changedAt:{type:Date,default:Date.now},
   reason:String
  }],
  emailDelivery:{
   status:{type:String,enum:["not_sent","pending","sent","failed"],default:"not_sent"},
   sentAt:Date,
   error:String
  }
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
 finalMark:Number,
 bestTwoMarks:[Number],
 finalMarkCalculatedAt:Date,
 finalMarkStatus:{
  type:String,
  enum:["pending","calculated","approved","published"],
  default:"pending"
 },
 thirdEvaluatorRequired:{type:Boolean,default:false},
 thirdEvaluatorRequirementType:{
  type:String,
  enum:["none","automatic","manual"],
  default:"none"
 },
 thirdEvaluatorRequirementReason:String,
 thirdEvaluatorRequiredBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
 thirdEvaluatorRequiredAt:Date,
 evaluationThreshold:{type:Number,default:()=>Number(process.env.THIRD_EVALUATOR_THRESHOLD || 14)},
 resultPublished:{type:Boolean,default:false},
 resultPublishedAt:Date,
 resultPublishedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
 ,
 studentFeedback:String,
 studentFeedbackPublished:{type:Boolean,default:false},
 studentFeedbackPublishedAt:Date

},{timestamps:true})

module.exports = mongoose.model("Thesis",thesisSchema)
