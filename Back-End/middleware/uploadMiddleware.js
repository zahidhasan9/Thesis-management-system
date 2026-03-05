//PDF Upload
const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder project root এ
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique filename
  }
});

// File filter (optional, শুধু PDF নিতে চাইলে)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload; 


// //Student Upload Thesis
// exports.uploadThesis = async (req, res) => {
//   const Thesis = require("../models/Thesis");

//   const thesis = await Thesis.create({
//     student: req.user._id,
//     title: req.body.title,
//     pdf: req.file.path,
//   });

//   res.json(thesis);
// };


// //Supervisor Accept / Reject
// exports.reviewThesis = async (req, res) => {
//   const Thesis = require("../models/Thesis");

//   const { thesisId, status, note } = req.body;

//   const thesis = await Thesis.findByIdAndUpdate(
//     thesisId,
//     {
//       status,
//       supervisorNote: note,
//     },
//     { new: true }
//   );

//   res.json(thesis);
// };


// //Mark Calculation Logic
// module.exports = (m1, m2, m3 = null) => {
//   const diff = Math.abs(m1 - m2);

//   if (diff <= 14) {
//     return Math.max(m1, m2);
//   }

//   return Math.max(m1, m2) + m3;
// };

// //Evaluator Marking
// exports.giveMark = async (req, res) => {
//   const Thesis = require("../models/Thesis");

//   const { thesisId, mark } = req.body;

//   const thesis = await Thesis.findById(thesisId);

//   thesis.evaluatorMarks.push({
//     evaluator: req.user._id,
//     mark,
//   });

//   if (thesis.evaluatorMarks.length === 2) {
//     const m1 = thesis.evaluatorMarks[0].mark;
//     const m2 = thesis.evaluatorMarks[1].mark;

//     if (Math.abs(m1 - m2) <= 14) {
//       thesis.finalMark = Math.max(m1, m2);
//     }
//   }

//   await thesis.save();

//   res.json(thesis);
// };