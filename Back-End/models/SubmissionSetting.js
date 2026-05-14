const mongoose = require("mongoose");

const submissionSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "thesis_submission",
      unique: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubmissionSetting", submissionSettingSchema);