const Thesis = require("../models/Thesis")
const User = require("../models/User")
const SubmissionSetting = require("../models/SubmissionSetting");
const { sanitizeForStudent } = require("../services/evaluationPrivacy");
const { assignProjectId } = require("../services/projectId");
const AuditLog = require("../models/AuditLog");
const { recordAudit } = require("../utils/audit");
const fs = require("fs");

const uploadedFiles = (req) => Object.values(req.files || {}).flat();
const removeUploadedFiles = (files) => {
  files.filter(Boolean).forEach((file) => {
    if (file?.path) fs.promises.unlink(file.path).catch(() => undefined);
  });
};

exports.uploadThesis = async(req,res)=>{

 const title = String(req.body.title || "").trim();
 const description = String(req.body.description || "").trim();
 const aiScoreInput = req.body.aiScore;
 const plagiarismScoreInput = req.body.plagiarismScore;
 const aiScore = Number(aiScoreInput);
 const plagiarismScore = Number(plagiarismScoreInput);
 const aiCheckUrl = String(req.body.aiCheckUrl || "").trim();
 const plagiarismCheckUrl = String(req.body.plagiarismCheckUrl || "").trim();

 const files = uploadedFiles(req);
 const thesisPdf = req.files?.pdf?.[0];
 if (!title || !thesisPdf) {
  removeUploadedFiles(files);
  return res.status(400).json({message:"Title and thesis PDF are required"});
 }

 const invalidScore = (score, input) =>
  input === undefined || input === null || String(input).trim() === "" ||
  !Number.isFinite(score) || score < 0 || score >= 25;

 if (invalidScore(aiScore, aiScoreInput) || invalidScore(plagiarismScore, plagiarismScoreInput)) {
  removeUploadedFiles(files);
  return res.status(400).json({
   message:"AI and plagiarism scores must be between 0% and less than 25%"
  });
 }

 const isValidReferenceUrl = (value) => {
  try {
   const url = new URL(value);
   return url.protocol === "http:" || url.protocol === "https:";
  } catch {
   return false;
  }
 };

 if (!isValidReferenceUrl(aiCheckUrl) || !isValidReferenceUrl(plagiarismCheckUrl)) {
  removeUploadedFiles(files);
  return res.status(400).json({
   message:"Valid AI and plagiarism reference links are required"
  });
 }

 try {
  const thesis = await Thesis.create({

  student:req.user._id,

  title,
  description,
  aiScore,
  plagiarismScore,
  aiCheckUrl,
  plagiarismCheckUrl,

  pdf:thesisPdf.path,
  aiReportPdf:req.files?.aiReportPdf?.[0]?.path,
  plagiarismReportPdf:req.files?.plagiarismReportPdf?.[0]?.path,

  })

  await assignProjectId(thesis, req.user)
  await recordAudit({
   thesis: thesis._id,
   action: "THESIS_SUBMITTED",
   newValue: { submittedAt: thesis.createdAt },
   user: req.user,
  });

  return res.status(201).json(thesis)
 } catch (error) {
  removeUploadedFiles(files);
  console.error("Thesis upload error:", error);
  return res.status(500).json({message:"Thesis upload failed"});
 }

}

exports.myThesis = async(req,res)=>{

 const thesis = await Thesis.find({
  student:req.user._id
 }).populate("supervisor", "idNo")
   .select("-evaluatorMarks -thirdEvaluatorMark -evaluatorAssignments")
   .lean()

 res.json(thesis.map(sanitizeForStudent))

}

exports.deleteThesis = async(req,res)=>{

 const thesis = await Thesis.findById(req.params.id)

 if(thesis.status==="accepted"){
  return res.json({
   message:"Cannot delete accepted thesis"
  })
 }

 await Thesis.findByIdAndDelete(req.params.id)

 res.json({message:"Deleted"})

}

exports.getSingleThesis = async (req, res) => {
  try {
    const { id } = req.params;

    const thesis = await Thesis.findOne({
      _id: id,
      student: req.user._id,
    })
      .populate("student", "name email idNo phone")
      .populate("supervisor", "idNo")
      .select("-evaluatorMarks -thirdEvaluatorMark -evaluatorAssignments.mark -evaluatorAssignments.feedback -evaluatorAssignments.evaluator");

    if (!thesis) {
      return res.status(404).json({
        message: "Thesis not found",
      });
    }

    res.json(sanitizeForStudent(thesis));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getThesisTimeline = async (req, res) => {
 try {
  const thesis = await Thesis.findOne({ _id: req.params.id, student: req.user._id })
   .select("createdAt finalMarkStatus resultPublished resultPublishedAt");
  if (!thesis) return res.status(404).json({ message: "Thesis not found" });
  const actionDetails = {
   THESIS_SUBMITTED: "Thesis submitted",
   SUPERVISOR_ASSIGNMENT_ACCEPTED: "Supervisor accepted thesis",
   EVALUATOR_ASSIGNMENT_ACCEPTED: "Evaluator accepted review assignment",
   EVALUATOR_MARK_SUBMITTED: "Evaluator review completed",
   FINAL_MARK_CALCULATED: "Evaluation completed",
   FINAL_MARK_APPROVED: "Final result approved",
   RESULT_PUBLISHED: "Result published",
  };
  const logs = await AuditLog.find({ thesis: thesis._id, action: { $in: Object.keys(actionDetails) } })
   .select("action createdAt newValue")
   .sort({ createdAt: 1 })
   .lean();
  const timeline = logs.map((log) => ({
   action: log.action,
   label: actionDetails[log.action],
   at: log.createdAt,
   position: log.newValue?.position,
  }));
  if (!timeline.some((item) => item.action === "THESIS_SUBMITTED")) {
   timeline.unshift({ action: "THESIS_SUBMITTED", label: "Thesis submitted", at: thesis.createdAt });
  }
  res.json(timeline);
 } catch (error) {
  res.status(500).json({ message: "Could not load thesis timeline" });
 }
};


// Get logged-in student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update logged-in student profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, idNo ,batch ,Section,department} = req.body;

    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // email unique check
    if (email && email !== student.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // idNo unique check
    if (idNo && idNo !== student.idNo) {
      const existingIdNo = await User.findOne({ idNo });
      if (existingIdNo) {
        return res.status(400).json({ message: "Student ID already exists" });
      }
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.idNo = idNo || student.idNo;
    student.batch = batch || student.batch;
    student.Section = Section || student.Section;
    student.department = department || student.department;

    await student.save();

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      idNo: student.idNo,
      role: student.role,
      batch: student.batch,
      Section: student.Section,
      department: student.department,
      profileImage: student.profileImage,

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.recentThesisLibrary = async (req, res) => {
  try {
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const thesis = await Thesis.find({
      createdAt: { $gte: fourMonthsAgo },
      status: { $in: ["accepted", "completed"] },
    })
      .populate("student", "name department batch Section")
      .populate("supervisor", "name department")
      .select("title description pdf status createdAt student supervisor")
      .sort({ createdAt: -1 });

    res.json(thesis);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};



exports.getStudentSubmissionStatus = async (req, res) => {
  try {
    const status = await getSubmissionStatus();
    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkSubmissionDeadline = async (req, res, next) => {
  try {
    const status = await getSubmissionStatus();

    if (!status.isOpen) {
      return res.status(403).json({
        message: "Thesis submission deadline is over. You cannot upload now.",
        deadline: status.deadline,
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// ----------Helper Function--------------
const getSubmissionStatus = async () => {
  const setting = await SubmissionSetting.findOne({
    key: "thesis_submission",
  });

  if (!setting) {
    return {
      isOpen: true,
      deadline: null,
      message: "No deadline has been set yet",
    };
  }

  const now = new Date();
  const isOpen = setting.isActive && now <= setting.deadline;

  return {
    isOpen,
    deadline: setting.deadline,
    isActive: setting.isActive,
    message: isOpen
      ? "Thesis submission is open"
      : "Thesis submission deadline is over",
  };
};
