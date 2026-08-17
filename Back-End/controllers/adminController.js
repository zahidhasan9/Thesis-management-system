const User = require("../models/User");
const Thesis = require("../models/Thesis");
const { assignProjectId, ensureProjectIds } = require("../services/projectId");
const SubmissionSetting = require("../models/SubmissionSetting");
const mongoose = require("mongoose");

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;

exports.getUsers = async (req, res) => {
  const users = await User.find();

  res.json(users);
};

// PATCH /admin/users/:id
exports.changeRole = async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (role === "evaluator") {
    const count = await User.countDocuments({ role: "evaluator" });
    if (count >= 2) {
      return res.status(400).json({ message: "Only 3 evaluators allowed" });
    }
  }

  if (role === "third_evaluator") {
    const count = await User.countDocuments({ role: "third_evaluator" });
    if (count >= 1) {
      return res
        .status(400)
        .json({ message: "Only 1 third_evaluator allowed" });
    }
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

exports.getDashboardStats = async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const pending = await Thesis.countDocuments({ status: "pending" });
  const completed = await Thesis.countDocuments({ status: "completed" });

  res.json({ totalStudents, pending, completed });
};

// Pending Thesis
exports.getPendingThesis = async (req, res) => {
  try {
    const pending = await Thesis.find({ status: "pending" }).populate(
      "student",
      "name email",
    ); // student info add

    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Chart Data
exports.getChartData = async (req, res) => {
  try {
    const result = await Thesis.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // aggregate data
    const chartData = result.map((r) => ({
      month: r._id, // 1-12
      count: r.count,
    }));

    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Admin cannot delete themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If student, delete their thesis
    if (user.role === "student") {
      await Thesis.deleteMany({ student: user._id });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all thesis
exports.getAllThesis = async (req, res) => {
  try {
    const thesis = await Thesis.find()
      .populate("student")
      .populate("supervisor", "name email role")
      .populate("evaluatorAssignments.evaluator", "name email role")
      .populate({ path: "thirdEvaluatorMark.evaluator" })
      .populate({ path: "evaluatorMarks.evaluator" });
    await ensureProjectIds(thesis);
    res.json(thesis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a thesis
exports.deleteThesis = async (req, res) => {
  try {
    const { id } = req.params;
    const thesis = await Thesis.findByIdAndDelete(id);
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });

    res.json({ message: "Thesis deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmissionSetting = async (req, res) => {
  try {
    let setting = await SubmissionSetting.findOne({
      key: "thesis_submission",
    });

    if (!setting) {
      return res.json({
        deadline: null,
        isActive: false,
        message: "No submission deadline has been set yet",
      });
    }

    const now = new Date();
    const isOpen = setting.isActive && now <= setting.deadline;

    res.json({
      deadline: setting.deadline,
      isActive: setting.isActive,
      isOpen,
      message: isOpen
        ? "Thesis submission is open"
        : "Thesis submission is closed",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.setSubmissionDeadline = async (req, res) => {
  try {
    const { deadline, isActive } = req.body;

    if (!deadline) {
      return res.status(400).json({
        message: "Deadline is required",
      });
    }

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        message: "Invalid deadline date",
      });
    }

    const setting = await SubmissionSetting.findOneAndUpdate(
      { key: "thesis_submission" },
      {
        key: "thesis_submission",
        deadline: deadlineDate,
        isActive: isActive ?? true,
        updatedBy: req.user._id,
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.json({
      message: "Submission deadline updated successfully",
      setting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /admin/users/:id/status
exports.updateAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "pending", "disabled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid account status",
      });
    }

    if (req.user._id.toString() === id && status !== "active") {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (status === "active") {
      user.status = "active";
      user.isActive = true;
      user.activatedAt = new Date();
      user.disabledAt = null;
      user.deleteAfter = null;
    }

    if (status === "pending") {
      user.status = "pending";
      user.isActive = false;
      user.activatedAt = null;
      user.disabledAt = null;
      user.deleteAfter = new Date(Date.now() + FIFTEEN_DAYS);
    }

    if (status === "disabled") {
      user.status = "disabled";
      user.isActive = false;
      user.disabledAt = new Date();
      user.deleteAfter = new Date(Date.now() + FIFTEEN_DAYS);
    }

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.json({
      message:
        status === "active"
          ? "Account activated successfully"
          : status === "disabled"
            ? "Account disabled successfully"
            : "Account moved to pending",
      user: safeUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Project roles are assignments, so there is no global limit on staff users.
exports.changeRole = async (req, res) => {
  try {
    const allowedRoles = [
      "supervisor",
      "evaluator",
      "third_evaluator",
      "admin",
    ];
    const { role } = req.body;
    if (role === "student") {
      return res.status(400).json({
        message: "Staff accounts cannot be changed to student",
      });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "student") {
      return res.status(400).json({
        message: "Student roles cannot be changed",
      });
    }

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEligibleStaff = async (req, res) => {
  try {
    const users = await User.find({
      status: "active",
      isActive: true,
      role: { $in: ["supervisor", "evaluator", "third_evaluator"] },
    })
      .select("name email department position role")
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignReviewers = async (req, res) => {
  try {
    const { supervisorId, evaluatorIds = [] } = req.body;
    const thesis = await Thesis.findById(req.params.id);
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });
    if (!supervisorId)
      return res.status(400).json({ message: "Supervisor is required" });
    if (
      !Array.isArray(evaluatorIds) ||
      evaluatorIds.length < 2 ||
      evaluatorIds.length > 3
    ) {
      return res
        .status(400)
        .json({ message: "Select two or three evaluators" });
    }

    const ids = [supervisorId, ...evaluatorIds].map(String);
    if (new Set(ids).size !== ids.length) {
      return res
        .status(400)
        .json({
          message: "A person cannot hold multiple roles on the same project",
        });
    }

    const staff = await User.find({
      _id: { $in: ids },
      status: "active",
      isActive: true,
      role: { $in: ["supervisor", "evaluator", "third_evaluator"] },
    });
    if (staff.length !== ids.length) {
      return res
        .status(400)
        .json({ message: "All selected reviewers must be active staff" });
    }

    const sameSupervisor =
      thesis.supervisor?.toString() === supervisorId.toString();
    thesis.supervisor = supervisorId;
    if (!sameSupervisor || !thesis.supervisorRequest?.status) {
      thesis.supervisorRequest = { status: "pending" };
    }
    thesis.evaluators = evaluatorIds;
    const previousAssignments = thesis.evaluatorAssignments || [];
    thesis.evaluatorAssignments = evaluatorIds.map((evaluator, index) => {
      const existing = previousAssignments.find(
        (item) =>
          item.position === index + 1 &&
          item.evaluator.toString() === evaluator.toString(),
      );
      return (
        existing || {
          evaluator,
          position: index + 1,
          status: "pending",
          mark: null,
        }
      );
    });
    thesis.evaluatorMarks = [];
    thesis.thirdEvaluatorMark = undefined;
    thesis.finalMark = undefined;
    thesis.status =
      thesis.supervisorRequest?.status === "accepted" ? "accepted" : "pending";
    await thesis.save();

    const { sendEmail } = require("../utils/mailer");
    const recipients = staff.map((user) => user.email);
    Promise.allSettled(
      recipients.map((to) =>
        sendEmail({
          to,
          subject: `Thesis review assignment: ${thesis.title}`,
          text: `You have received a thesis review assignment for "${thesis.title}". Please sign in to accept or reject the request.`,
          html: `<p>You have received a thesis review assignment for <strong>${thesis.title}</strong>.</p><p>Please sign in to accept or reject the request.</p>`,
        }),
      ),
    ).catch(() => undefined);

    const populated = await Thesis.findById(thesis._id)
      .populate("student", "name email idNo")
      .populate("supervisor", "name email role")
      .populate("evaluatorAssignments.evaluator", "name email role");
    res.json({
      message: "Review requests sent successfully",
      thesis: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleThesis = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid thesis ID" });
    }
    const thesis = await Thesis.findById(req.params.id)
      .populate("student")
      .populate("supervisor", "name email department phone role")
      .populate("evaluatorAssignments.evaluator", "name email department role")
      .populate("evaluatorMarks.evaluator", "name email role")
      .populate("thirdEvaluatorMark.evaluator", "name email role");
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });
    await assignProjectId(thesis, thesis.student);
    thesis.evaluationThreshold = Number(
      process.env.THIRD_EVALUATOR_THRESHOLD || 14,
    );
    res.json(thesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
