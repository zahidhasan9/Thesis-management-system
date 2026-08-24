const Thesis = require("../models/Thesis");
const User = require("../models/User");
const mongoose = require("mongoose");
const { recordAudit } = require("../utils/audit");
const { sendEmail } = require("../utils/mailer");
const { sendAssignmentEmail } = require("../utils/assignmentEmail");
const { notifyAdmins } = require("../utils/notifications");

exports.getAllThesis = async (req, res) => {
  try {
    const theses = await Thesis.find({ supervisor: req.user._id })
      .populate("student", "name email idNo department")
      .populate("supervisor", "name email role");
    res.json(theses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reviewThesis = async (req, res) => {
  try {
    const { thesisId, status, note = "" } = req.body;
    const normalized = status === "declined" ? "rejected" : status;
    if (!["accepted", "rejected"].includes(normalized)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }
    if (!mongoose.isValidObjectId(thesisId)) {
      return res.status(400).json({ message: "Invalid thesis ID" });
    }
    if (normalized === "rejected" && String(note).trim().length < 5) {
      return res.status(400).json({ message: "A rejection reason is required" });
    }
    const thesis = await Thesis.findOne({ _id: thesisId, supervisor: req.user._id });
    if (!thesis) return res.status(404).json({ message: "Assigned thesis not found" });
    const previousStatus = thesis.supervisorRequest?.status;
    const evaluatorAssignmentsToActivate =
      normalized === "accepted" && previousStatus !== "accepted"
        ? thesis.evaluatorAssignments.filter(
            (assignment) =>
              assignment.position <= 2 &&
              assignment.status === "awaiting_supervisor",
          )
        : [];
    thesis.supervisorRequest.status = normalized;
    thesis.supervisorRequest.note = note;
    thesis.supervisorRequest.rejectionReason =
      normalized === "rejected" ? String(note).trim() : undefined;
    thesis.supervisorRequest.respondedAt = new Date();
    thesis.supervisorNote = note;
    thesis.status = normalized === "accepted" ? "accepted" : "declined";
    evaluatorAssignmentsToActivate.forEach((assignment) => {
      assignment.status = "pending";
      assignment.emailDelivery = { status: "pending" };
    });
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action:
        normalized === "accepted"
          ? "SUPERVISOR_ASSIGNMENT_ACCEPTED"
          : "SUPERVISOR_ASSIGNMENT_REJECTED",
      previousValue: { status: previousStatus },
      newValue: { status: normalized },
      user: req.user,
      reason: normalized === "rejected" ? note : undefined,
    });
    if (evaluatorAssignmentsToActivate.length) {
      const [emailThesis, evaluators] = await Promise.all([
        Thesis.findById(thesis._id).populate("student", "name email"),
        User.find({
          _id: {
            $in: evaluatorAssignmentsToActivate.map(
              (assignment) => assignment.evaluator,
            ),
          },
          status: "active",
          isActive: true,
        }),
      ]);
      for (const assignment of evaluatorAssignmentsToActivate) {
        const evaluator = evaluators.find(
          (user) =>
            user._id.toString() === assignment.evaluator?.toString(),
        );
        try {
          if (!evaluator) throw new Error("Evaluator account is not active");
          await sendAssignmentEmail({
            user: evaluator,
            thesis: emailThesis,
            position: assignment.position,
            deadline: assignment.deadline,
          });
          assignment.emailDelivery = { status: "sent", sentAt: new Date() };
        } catch (error) {
          console.error("Evaluator assignment email failed:", error.message);
          assignment.emailDelivery = {
            status: "failed",
            error: error.message.slice(0, 500),
          };
        }
      }
      await thesis.save();
    }
    if (normalized === "rejected") {
      await notifyAdmins({
        thesis: thesis._id,
        type: "assignment_rejected",
        title: "Supervisor rejected an assignment",
        message: `${req.user.name} rejected ${thesis.title}. Reason: ${note}`,
        link: `/admin/thesis/${thesis._id}`,
      });
      const admins = await User.find({
        role: "admin",
        status: "active",
        isActive: true,
      }).select("email");
      await Promise.allSettled(
        admins.map((admin) =>
          sendEmail({
            to: admin.email,
            subject: `Supervisor assignment rejected: ${thesis.title}`,
            text: `${req.user.name} rejected the Supervisor assignment for ${thesis.title}. Reason: ${note}`,
            html: `<p><strong>${req.user.name}</strong> rejected the Supervisor assignment for <strong>${thesis.title}</strong>.</p><p><strong>Reason:</strong> ${note}</p>`,
          }),
        ),
      );
    }
    res.json({ message: `Supervisor request ${normalized}`, thesis });
  } catch (err) {
    console.error("Supervisor review failed:", err);
    res.status(500).json({ message: "Could not update Supervisor assignment" });
  }
};

exports.getSingleThesis = async (req, res) => {
  try {
    const thesis = await Thesis.findOne({ _id: req.params.id, supervisor: req.user._id })
      .populate("student", "name email idNo department phone")
      .populate("supervisor", "name email role");
    if (!thesis) return res.status(404).json({ message: "Assigned thesis not found" });
    const data = thesis.toObject();
    delete data.evaluatorMarks;
    delete data.thirdEvaluatorMark;
    data.evaluatorAssignments = (data.evaluatorAssignments || []).map(({ position, status }) => ({ position, status }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignEvaluators = async (req, res) => res.status(403).json({ message: "Only admin can assign evaluators" });

exports.getProfile = async (req, res) => {
  const supervisor = await User.findById(req.user._id).select("-password");
  res.json(supervisor);
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone", "department", "position", "bio"];
    const changes = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
    const updated = await User.findByIdAndUpdate(req.user._id, changes, { new: true, runValidators: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
