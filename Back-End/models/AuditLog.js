const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    thesis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thesis",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByRole: String,
    reason: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
