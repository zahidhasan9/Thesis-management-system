// const mongoose = require("mongoose")

// const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
// const userSchema = new mongoose.Schema({

//  name:String,

//  email:{
//   type:String,
//   unique:true
//  },

//  phone:String,
//  idNo:String,
//  department: { type: String },
//  batch:String,
//  Section:String,
//  position:String, // For supervisors: Professor, Associate Professor, etc.
//  password:String,
//  bio:String ,

//  role:{
//   type:String,
//   enum:["student","supervisor","evaluator","admin","third_evaluator"],
//   default:"student"
//  },

//  session:String,

//  status: {
//   type: String,
//   enum: ["pending", "active", "disabled"],
//   default: "pending",
// },

// isActive: {
//   type: Boolean,
//   default: false,
// },

// activatedAt: {
//   type: Date,
// },

// disabledAt: {
//   type: Date,
// },

// deleteAfter: {
//       type: Date,
//       default: function () {
//         return new Date(Date.now() + FIFTEEN_DAYS);
//                           }
// },

// },{timestamps:true})

// module.exports = mongoose.model("User",userSchema)

const mongoose = require("mongoose");

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    idNo: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    Section: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
    lastLoginAt: Date,
    lastLoginIp: String,
    lastLoginUserAgent: String,

    bio: String,

    role: {
      type: String,
      enum: ["student", "supervisor", "evaluator", "admin", "third_evaluator"],
      default: "student",
    },
    session: String,

    status: {
      type: String,
      enum: ["pending", "active", "disabled"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activatedAt: Date,
    disabledAt: Date,
    deleteAfter: {
      type: Date,
      default: function () {
        return new Date(Date.now() + FIFTEEN_DAYS);
      },
    },

    /*
     * Migration-safe default:
     * - Existing users without this field can continue logging in.
     * - Student registration explicitly sets this field to false.
     * - Admin-created users remain verified by default.
     */
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    emailVerifiedAt: Date,
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    lastVerificationEmailSentAt: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ deleteAfter: 1 });

module.exports = mongoose.model("User", userSchema);
