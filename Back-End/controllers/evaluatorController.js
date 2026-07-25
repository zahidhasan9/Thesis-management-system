const mongoose = require("mongoose");
const Thesis = require("../models/Thesis");
const User = require("../models/User");
const { applyEvaluationCalculation } = require("../services/evaluationService");
const { recordAudit } = require("../utils/audit");
const { sendEmail } = require("../utils/mailer");
const { sanitizeForEvaluator } = require("../services/evaluationPrivacy");
const { notifyAdmins } = require("../utils/notifications");

const assignmentFor = (thesis, userId) =>
  thesis.evaluatorAssignments.find(
    (item) =>
      (item.evaluator?._id || item.evaluator).toString() === userId.toString(),
  );

const validThesisId = (id) => mongoose.isValidObjectId(id);

exports.getAccepted = async (req, res) => {
  try {
    const theses = await Thesis.find({
      evaluatorAssignments: { $elemMatch: { evaluator: req.user._id } },
    })
      .populate("student", "name idNo department")
      .populate("evaluatorAssignments.evaluator", "name email role");
    res.json(theses.map((thesis) => sanitizeForEvaluator(thesis, req.user._id)));
  } catch (error) {
    res.status(500).json({ message: "Could not load evaluator assignments" });
  }
};

exports.respondToAssignment = async (req, res) => {
  try {
    if (!validThesisId(req.params.id)) {
      return res.status(400).json({ message: "Invalid thesis ID" });
    }
    const status = req.body.status;
    const rejectionReason = String(req.body.rejectionReason || "").trim();
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected",
      });
    }
    if (status === "rejected" && rejectionReason.length < 5) {
      return res.status(400).json({
        message: "A rejection reason is required",
      });
    }
    const thesis = await Thesis.findById(req.params.id);
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });
    const assignment = assignmentFor(thesis, req.user._id);
    if (!assignment) {
      return res.status(403).json({
        message: "This thesis is not assigned to you",
      });
    }
    if (assignment.markLocked || assignment.mark != null) {
      return res.status(409).json({
        message: "A submitted evaluation cannot be rejected",
      });
    }
    const previousStatus = assignment.status;
    assignment.status = status;
    assignment.rejectionReason =
      status === "rejected" ? rejectionReason : undefined;
    assignment.respondedAt = new Date();
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action:
        status === "accepted"
          ? "EVALUATOR_ASSIGNMENT_ACCEPTED"
          : "EVALUATOR_ASSIGNMENT_REJECTED",
      previousValue: { position: assignment.position, status: previousStatus },
      newValue: { position: assignment.position, status },
      user: req.user,
      reason: rejectionReason || undefined,
    });
    if (status === "rejected") {
      await notifyAdmins({
        thesis: thesis._id,
        type: "assignment_rejected",
        title: `Evaluator ${assignment.position} rejected an assignment`,
        message: `${req.user.name} rejected ${thesis.title}. Reason: ${rejectionReason}`,
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
            subject: `Evaluator assignment rejected: ${thesis.title}`,
            text: `${req.user.name} rejected Evaluator ${assignment.position} assignment for ${thesis.title}. Reason: ${rejectionReason}`,
            html: `<p><strong>${req.user.name}</strong> rejected Evaluator ${assignment.position} assignment for <strong>${thesis.title}</strong>.</p><p><strong>Reason:</strong> ${rejectionReason}</p>`,
          }),
        ),
      );
    }
    res.json({
      message: `Assignment ${status}`,
      assignment: sanitizeForEvaluator(thesis, req.user._id)
        .evaluatorAssignments[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update assignment response" });
  }
};

exports.submitMark = async (req, res) => {
  try {
    if (!validThesisId(req.body.thesisId)) {
      return res.status(400).json({ message: "Invalid thesis ID" });
    }
    const rubricKeys = [
      "researchQuality",
      "methodology",
      "implementation",
      "reportQuality",
      "presentation",
    ];
    const rubricProvided =
      req.body.rubric &&
      rubricKeys.every((key) => req.body.rubric[key] !== undefined);
    const rubric = rubricProvided
      ? Object.fromEntries(
          rubricKeys.map((key) => [key, Number(req.body.rubric[key])]),
        )
      : null;
    if (
      rubric &&
      Object.values(rubric).some(
        (score) => !Number.isFinite(score) || score < 0 || score > 20,
      )
    ) {
      return res.status(400).json({
        message: "Each rubric score must be between 0 and 20",
      });
    }
    const mark = rubric
      ? Object.values(rubric).reduce((total, score) => total + score, 0)
      : Number(req.body.mark);
    if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
      return res.status(400).json({
        message: "Mark must be between 0 and 100",
      });
    }
    const thesis = await Thesis.findById(req.body.thesisId);
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });
    const assignment = assignmentFor(thesis, req.user._id);
    if (!assignment) {
      return res.status(403).json({
        message: "This thesis is not assigned to you",
      });
    }
    if (!["accepted", "evaluation_pending"].includes(assignment.status)) {
      return res.status(409).json({
        message: "Accept the assignment before submitting a mark",
      });
    }
    if (assignment.markLocked || assignment.mark != null) {
      return res.status(409).json({
        message: "Your submitted mark is locked",
      });
    }
    if (assignment.position === 3 && !thesis.thirdEvaluatorRequired) {
      return res.status(409).json({
        message: "Third evaluation is not required for this thesis",
      });
    }

    assignment.mark = mark;
    assignment.feedback = String(req.body.feedback || "").trim();
    assignment.recommendation = String(req.body.recommendation || "").trim();
    if (rubric) assignment.rubric = rubric;
    assignment.submittedAt = new Date();
    assignment.markLocked = true;
    assignment.status = "mark_submitted";
    const correction = assignment.markHistory?.findLast(
      (item) => item.newMark == null,
    );
    if (correction) {
      correction.newMark = mark;
      correction.changedBy = req.user._id;
      correction.changedAt = new Date();
    }

    const wasThirdRequired = thesis.thirdEvaluatorRequired;
    const result = applyEvaluationCalculation(thesis);
    await thesis.save();

    await recordAudit({
      thesis: thesis._id,
      action: "EVALUATOR_MARK_SUBMITTED",
      newValue: {
        position: assignment.position,
        mark,
        submittedAt: assignment.submittedAt,
      },
      user: req.user,
    });
    await notifyAdmins({
      thesis: thesis._id,
      type: "mark_submitted",
      title: `Evaluator ${assignment.position} submitted a mark`,
      message: `${req.user.name} completed the evaluation for ${thesis.title}.`,
      link: `/admin/thesis/${thesis._id}`,
    });
    if (!wasThirdRequired && thesis.thirdEvaluatorRequired) {
      await notifyAdmins({
        thesis: thesis._id,
        type: "third_evaluator_required",
        title: "Third Evaluator required",
        message: thesis.thirdEvaluatorRequirementReason,
        link: `/admin/thesis/${thesis._id}`,
      });
      await recordAudit({
        thesis: thesis._id,
        action: "THIRD_EVALUATION_AUTOMATICALLY_REQUIRED",
        newValue: {
          difference: result.difference,
          threshold: result.threshold,
        },
        user: req.user,
        reason: thesis.thirdEvaluatorRequirementReason,
      });
    }
    if (result.finalMark != null) {
      await recordAudit({
        thesis: thesis._id,
        action: "FINAL_MARK_CALCULATED",
        newValue: {
          finalMark: result.finalMark,
          bestTwoMarks: result.bestTwoMarks,
        },
        user: req.user,
      });
    }
    res.json({
      message: "Evaluation submitted and locked",
      thesis: sanitizeForEvaluator(thesis, req.user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not submit evaluation" });
  }
};

exports.submitThirdEvaluatorMark = exports.submitMark;
exports.getPendingThirdEvaluator = exports.getAccepted;

exports.getThesisById = async (req, res) => {
  try {
    if (!validThesisId(req.params.id)) {
      return res.status(400).json({ message: "Invalid thesis ID" });
    }
    const thesis = await Thesis.findById(req.params.id)
      .populate("student", "name idNo department")
      .populate("evaluatorAssignments.evaluator", "name email role");
    if (!thesis) return res.status(404).json({ message: "Thesis not found" });
    if (!assignmentFor(thesis, req.user._id)) {
      return res.status(403).json({
        message: "This thesis is not assigned to you",
      });
    }
    res.json(sanitizeForEvaluator(thesis, req.user._id));
  } catch (error) {
    res.status(500).json({ message: "Could not load thesis" });
  }
};

exports.getEvaluatorProfile = async (req, res) => {
  const evaluator = await User.findById(req.user._id).select("-password");
  res.json(evaluator);
};

exports.updateEvaluatorProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone", "department", "position", "bio"];
    const changes = Object.fromEntries(
      allowed
        .filter((key) => req.body[key] !== undefined)
        .map((key) => [key, req.body[key]]),
    );
    const updated = await User.findByIdAndUpdate(req.user._id, changes, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Could not update profile" });
  }
};
