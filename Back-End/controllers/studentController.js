const Thesis = require("../models/Thesis")
const User = require("../models/User")
const SubmissionSetting = require("../models/SubmissionSetting");

exports.uploadThesis = async(req,res)=>{

 const thesis = await Thesis.create({

  student:req.user._id,

  title:req.body.title,
  description:req.body.description,

  pdf:req.file.path

 })

 res.json(thesis)

}

exports.myThesis = async(req,res)=>{

 const thesis = await Thesis.find({
  student:req.user._id
 }).populate("supervisor")
   .populate({path:"thirdEvaluatorMark.evaluator"})
   .populate({path: "evaluatorMarks.evaluator"})

 res.json(thesis)

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
      .populate("supervisor", "name email department phone")
      .populate("evaluatorMarks.evaluator", "name email role")
      .populate("thirdEvaluatorMark.evaluator", "name email role");

    if (!thesis) {
      return res.status(404).json({
        message: "Thesis not found",
      });
    }

    res.json(thesis);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
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