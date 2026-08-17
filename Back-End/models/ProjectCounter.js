const mongoose = require("mongoose");

const projectCounterSchema = new mongoose.Schema({
  academicSession: { type: String, required: true, unique: true },
  sequence: { type: Number, default: 0 },
});

module.exports = mongoose.model("ProjectCounter", projectCounterSchema);
