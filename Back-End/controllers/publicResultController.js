const User = require("../models/User");
const Thesis = require("../models/Thesis");
const { sanitizeForPublicResult } = require("../services/evaluationPrivacy");

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

exports.lookupResults = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const studentId = String(req.body.studentId || "").trim();
    if (!email || !studentId) {
      return res.status(400).json({
        message: "Email and Student ID are required",
      });
    }
    if (email.length > 254 || studentId.length > 100) {
      return res.status(400).json({ message: "Invalid lookup information" });
    }

    const student = await User.findOne({
      email,
      idNo: studentId,
      role: "student",
      status: "active",
      isActive: true,
    }).select("name idNo");

    if (!student) {
      return res.json({
        student: null,
        results: [],
        message: "No published results matched the provided information.",
      });
    }

    const theses = await Thesis.find({
      student: student._id,
      resultPublished: true,
      finalMarkStatus: "published",
      finalMark: { $type: "number" },
    })
      .select(
        "projectId title status supervisor finalMark finalMarkStatus resultPublishedAt studentFeedback studentFeedbackPublished",
      )
      .populate("supervisor", "name department")
      .sort({ resultPublishedAt: -1 });

    return res.json({
      student: {
        name: student.name,
        studentId: student.idNo,
      },
      results: theses.map(sanitizeForPublicResult),
      message: theses.length
        ? "Published results found."
        : "No published results matched the provided information.",
    });
  } catch (error) {
    console.error("Public result lookup failed:", error);
    return res.status(500).json({ message: "Could not verify results" });
  }
};
