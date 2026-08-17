const mongoose = require("mongoose");
const User = require("../models/User");
const Thesis = require("../models/Thesis");
const AuditLog = require("../models/AuditLog");
const {
  DEFAULT_THRESHOLD,
  applyEvaluationCalculation,
  getEvaluationState,
} = require("../services/evaluationService");
const { recordAudit } = require("../utils/audit");
const {
  sendAssignmentEmail,
  sendPublishedResultEmail,
} = require("../utils/assignmentEmail");
const { createNotification } = require("../utils/notifications");
const { sendEvaluationReminders } = require("../utils/evaluationReminders");

const STAFF_ROLES = ["supervisor", "evaluator", "third_evaluator"];

const validId = (id) => mongoose.isValidObjectId(id);

const populateEvaluation = (query) =>
  query
    .populate("student", "name email idNo department")
    .populate("supervisor", "name email department position role")
    .populate(
      "evaluatorAssignments.evaluator",
      "name email department position role",
    )
    .populate("resultPublishedBy", "name email");

const requireThesis = async (id, res) => {
  if (!validId(id)) {
    res.status(400).json({ message: "Invalid thesis ID" });
    return null;
  }
  const thesis = await Thesis.findById(id);
  if (!thesis) {
    res.status(404).json({ message: "Thesis not found" });
    return null;
  }
  return thesis;
};

const eligibleStaffByIds = async (ids) => {
  if (ids.some((id) => !validId(id))) return [];
  return User.find({
    _id: { $in: ids },
    status: "active",
    isActive: true,
    role: { $in: STAFF_ROLES },
  });
};

const updateEmailStatus = async (thesis, target, send) => {
  target.emailDelivery = { status: "pending" };
  await thesis.save();
  try {
    await send();
    target.emailDelivery = { status: "sent", sentAt: new Date() };
  } catch (error) {
    console.error("Assignment email failed:", error.message);
    target.emailDelivery = {
      status: "failed",
      error: error.message.slice(0, 500),
    };
  }
  await thesis.save();
};

exports.getEligibleStaff = async (req, res) => {
  try {
    const [users, evaluatorWorkload, supervisorWorkload] = await Promise.all([
      User.find({
        status: "active",
        isActive: true,
        role: { $in: STAFF_ROLES },
      })
        .select("name email department university position role profileImage")
        .sort({ name: 1 })
        .lean(),
      Thesis.aggregate([
        { $unwind: "$evaluatorAssignments" },
        {
          $match: {
            "evaluatorAssignments.status": {
              $in: ["pending", "accepted", "evaluation_pending"],
            },
          },
        },
        {
          $group: {
            _id: "$evaluatorAssignments.evaluator",
            count: { $sum: 1 },
          },
        },
      ]),
      Thesis.aggregate([
        {
          $match: {
            supervisor: { $ne: null },
            "supervisorRequest.status": { $in: ["pending", "accepted"] },
          },
        },
        { $group: { _id: "$supervisor", count: { $sum: 1 } } },
      ]),
    ]);
    const counts = new Map();
    [...evaluatorWorkload, ...supervisorWorkload].forEach((item) => {
      const key = item._id.toString();
      counts.set(key, (counts.get(key) || 0) + item.count);
    });
    res.json(
      users.map((user) => ({
        ...user,
        university:
          user.university || process.env.DEFAULT_UNIVERSITY_NAME || "NSTU",
        currentWorkload: counts.get(user._id.toString()) || 0,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Could not load eligible faculty" });
  }
};

exports.assignCoreTeam = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const { supervisorId, evaluatorIds } = req.body;
    thesis.evaluationThreshold = DEFAULT_THRESHOLD;
    const deadline = req.body.deadline ? new Date(req.body.deadline) : null;
    if (deadline && Number.isNaN(deadline.getTime())) {
      return res.status(400).json({ message: "Invalid evaluation deadline" });
    }
    if (!validId(supervisorId) || !Array.isArray(evaluatorIds) || evaluatorIds.length !== 2) {
      return res.status(400).json({
        message: "Select one supervisor and exactly two evaluators",
      });
    }
    const ids = [supervisorId, ...evaluatorIds];
    const existingThird = thesis.evaluatorAssignments.find(
      (item) => item.position === 3,
    );
    if (
      existingThird &&
      ids.map(String).includes(existingThird.evaluator.toString())
    ) {
      return res.status(400).json({
        message:
          "The selected core team conflicts with the assigned Third Evaluator",
      });
    }
    if (new Set(ids.map(String)).size !== 3) {
      return res.status(400).json({
        message: "The supervisor and evaluator roles must use different users",
      });
    }
    const staff = await eligibleStaffByIds(ids);
    if (staff.length !== 3) {
      return res.status(400).json({
        message: "All selected faculty members must have active staff accounts",
      });
    }

    const previous = {
      supervisor: thesis.supervisor,
      assignments: thesis.evaluatorAssignments
        .filter((item) => item.position <= 2)
        .map((item) => ({
          evaluator: item.evaluator,
          position: item.position,
          status: item.status,
          rejectionReason: item.rejectionReason,
        })),
    };
    const oldAssignments = thesis.evaluatorAssignments || [];
    const oldSupervisorId = thesis.supervisor?.toString();
    const coreChanged =
      oldSupervisorId !== String(supervisorId) ||
      evaluatorIds.some((evaluator, index) => {
        const current = oldAssignments.find(
          (item) => item.position === index + 1,
        );
        return current?.evaluator.toString() !== String(evaluator);
      });
    const wasPublished = thesis.resultPublished;
    thesis.supervisor = supervisorId;
    if (oldSupervisorId !== String(supervisorId)) {
      thesis.supervisorRequest = { status: "pending" };
    }
    if (deadline) thesis.supervisorRequest.deadline = deadline;
    const third = oldAssignments.find((item) => item.position === 3);
    const firstTwo = evaluatorIds.map((evaluator, index) => {
      const position = index + 1;
      const same = oldAssignments.find(
        (item) =>
          item.position === position &&
          item.evaluator.toString() === String(evaluator),
      );
      if (same) {
        if (deadline) same.deadline = deadline;
        return same;
      }
      return { evaluator, position, status: "pending", mark: null, deadline };
    });
    thesis.evaluatorAssignments = third ? [...firstTwo, third] : firstTwo;
    thesis.evaluators = thesis.evaluatorAssignments.map((item) => item.evaluator);
    if (coreChanged) {
      thesis.finalMark = undefined;
      thesis.bestTwoMarks = [];
      thesis.finalMarkStatus = "pending";
      thesis.resultPublished = false;
      thesis.resultPublishedAt = undefined;
      thesis.resultPublishedBy = undefined;
    }
    await thesis.save();

    const populatedForEmail = await Thesis.findById(thesis._id).populate(
      "student",
      "name email",
    );
    const supervisor = staff.find((item) => item._id.toString() === String(supervisorId));
    if (oldSupervisorId !== String(supervisorId)) {
      await updateEmailStatus(thesis, thesis.supervisorRequest, () =>
        sendAssignmentEmail({
          user: supervisor,
          thesis: populatedForEmail,
          deadline,
          reassigned: Boolean(oldSupervisorId),
        }),
      );
    }
    for (const assignment of thesis.evaluatorAssignments.filter(
      (item) => item.position <= 2 && item.status === "pending",
    )) {
      const faculty = staff.find(
        (item) => item._id.toString() === assignment.evaluator.toString(),
      );
      await updateEmailStatus(thesis, assignment, () =>
        sendAssignmentEmail({
          user: faculty,
          thesis: populatedForEmail,
          position: assignment.position,
          deadline: assignment.deadline,
          reassigned: previous.assignments.some(
            (item) => item.position === assignment.position,
          ),
        }),
      );
    }

    await recordAudit({
      thesis: thesis._id,
      action: "REVIEW_TEAM_ASSIGNED",
      previousValue: previous,
      newValue: { supervisor: supervisorId, evaluatorIds },
      user: req.user,
    });
    if (coreChanged && wasPublished) {
      await recordAudit({
        thesis: thesis._id,
        action: "PUBLISHED_RESULT_CHANGED",
        previousValue: { resultPublished: true },
        newValue: { resultPublished: false },
        user: req.user,
        reason: "Review team assignment changed",
      });
    }
    const populated = await populateEvaluation(Thesis.findById(thesis._id));
    res.json({ message: "Review team assignments saved", thesis: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not assign review team" });
  }
};

exports.requireThirdEvaluator = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const reason = String(req.body.reason || "").trim();
    if (reason.length < 5) {
      return res.status(400).json({ message: "A reason is required" });
    }
    thesis.thirdEvaluatorRequired = true;
    thesis.thirdEvaluatorRequirementType = "manual";
    thesis.thirdEvaluatorRequirementReason = reason;
    thesis.thirdEvaluatorRequiredBy = req.user._id;
    thesis.thirdEvaluatorRequiredAt = new Date();
    thesis.finalMark = undefined;
    thesis.bestTwoMarks = [];
    thesis.finalMarkStatus = "pending";
    thesis.resultPublished = false;
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action: "THIRD_EVALUATION_MANUALLY_REQUIRED",
      newValue: { required: true, reason },
      user: req.user,
      reason,
    });
    res.json({ message: "Third evaluation is now required", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not require third evaluation" });
  }
};

exports.assignThirdEvaluator = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const { evaluatorId } = req.body;
    const deadline = req.body.deadline ? new Date(req.body.deadline) : null;
    if (!deadline || Number.isNaN(deadline.getTime())) {
      return res.status(400).json({ message: "Third Evaluator deadline is required" });
    }
    if (deadline <= new Date()) {
      return res.status(400).json({ message: "Third Evaluator deadline must be in the future" });
    }
    if (!thesis.thirdEvaluatorRequired) {
      return res.status(409).json({
        message: "Third evaluation has not been required for this thesis",
      });
    }
    if (!validId(evaluatorId)) {
      return res.status(400).json({ message: "Invalid evaluator ID" });
    }
    const occupied = [
      thesis.supervisor?.toString(),
      ...thesis.evaluatorAssignments
        .filter((item) => item.position <= 2)
        .map((item) => item.evaluator.toString()),
    ].filter(Boolean);
    if (occupied.includes(String(evaluatorId))) {
      return res.status(400).json({
        message: "Select a faculty member who has no role on this thesis",
      });
    }
    const [faculty] = await eligibleStaffByIds([evaluatorId]);
    if (!faculty) {
      return res.status(400).json({ message: "Evaluator must be active faculty" });
    }
    const existingIndex = thesis.evaluatorAssignments.findIndex(
      (item) => item.position === 3,
    );
    const previous =
      existingIndex >= 0
        ? thesis.evaluatorAssignments[existingIndex].toObject()
        : null;
    const assignment = {
      evaluator: evaluatorId,
      position: 3,
      status: "pending",
      mark: null,
      markLocked: false,
      deadline,
    };
    if (existingIndex >= 0) thesis.evaluatorAssignments[existingIndex] = assignment;
    else thesis.evaluatorAssignments.push(assignment);
    thesis.evaluators = thesis.evaluatorAssignments.map((item) => item.evaluator);
    thesis.finalMark = undefined;
    thesis.bestTwoMarks = [];
    thesis.finalMarkStatus = "pending";
    await thesis.save();

    const target = thesis.evaluatorAssignments.find((item) => item.position === 3);
    const populatedForEmail = await Thesis.findById(thesis._id).populate(
      "student",
      "name email",
    );
    await updateEmailStatus(thesis, target, () =>
      sendAssignmentEmail({
        user: faculty,
        thesis: populatedForEmail,
        position: 3,
        deadline,
        reassigned: Boolean(previous),
      }),
    );
    await recordAudit({
      thesis: thesis._id,
      action: previous ? "THIRD_EVALUATOR_REASSIGNED" : "THIRD_EVALUATOR_ASSIGNED",
      previousValue: previous,
      newValue: assignment,
      user: req.user,
    });
    const populated = await populateEvaluation(Thesis.findById(thesis._id));
    res.json({ message: "Third Evaluator request sent", thesis: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not assign Third Evaluator" });
  }
};

exports.resendAssignmentEmail = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const position = req.body.position === "supervisor" ? null : Number(req.body.position);
    let target;
    let userId;
    if (position === null) {
      target = thesis.supervisorRequest;
      userId = thesis.supervisor;
    } else {
      target = thesis.evaluatorAssignments.find((item) => item.position === position);
      userId = target?.evaluator;
    }
    if (!target || !userId) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    const user = await User.findById(userId);
    const populatedForEmail = await Thesis.findById(thesis._id).populate(
      "student",
      "name email",
    );
    await updateEmailStatus(thesis, target, () =>
      sendAssignmentEmail({ user, thesis: populatedForEmail, position }),
    );
    res.json({
      message:
        target.emailDelivery.status === "sent"
          ? "Assignment email sent"
          : "Assignment saved, but email delivery failed",
      emailDelivery: target.emailDelivery,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not resend assignment email" });
  }
};

exports.unlockMark = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const position = Number(req.params.position);
    const reason = String(req.body.reason || "").trim();
    const assignment = thesis.evaluatorAssignments.find(
      (item) => item.position === position,
    );
    if (!assignment || assignment.mark == null) {
      return res.status(404).json({ message: "Submitted mark not found" });
    }
    if (reason.length < 5) {
      return res.status(400).json({ message: "Unlock reason is required" });
    }
    const wasPublished = thesis.resultPublished;
    assignment.markHistory.push({
      previousMark: assignment.mark,
      changedBy: req.user._id,
      reason,
    });
    assignment.mark = null;
    assignment.feedback = undefined;
    assignment.recommendation = undefined;
    assignment.submittedAt = undefined;
    assignment.markLocked = false;
    assignment.status = "evaluation_pending";
    thesis.finalMark = undefined;
    thesis.bestTwoMarks = [];
    thesis.finalMarkStatus = "pending";
    thesis.resultPublished = false;
    thesis.resultPublishedAt = undefined;
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action: "MARK_UNLOCKED",
      previousValue: { position, mark: assignment.markHistory.at(-1).previousMark },
      newValue: { position, mark: null },
      user: req.user,
      reason,
    });
    if (wasPublished) {
      await recordAudit({
        thesis: thesis._id,
        action: "PUBLISHED_RESULT_CHANGED",
        previousValue: { resultPublished: true },
        newValue: { resultPublished: false },
        user: req.user,
        reason,
      });
    }
    res.json({ message: "Mark unlocked for resubmission", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not unlock mark" });
  }
};

exports.correctMark = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const position = Number(req.params.position);
    const mark = Number(req.body.mark);
    const reason = String(req.body.reason || "").trim();
    if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
      return res.status(400).json({ message: "Mark must be between 0 and 100" });
    }
    if (reason.length < 5) {
      return res.status(400).json({ message: "Correction reason is required" });
    }
    const assignment = thesis.evaluatorAssignments.find(
      (item) => item.position === position,
    );
    if (!assignment || assignment.mark == null) {
      return res.status(404).json({ message: "Submitted mark not found" });
    }
    const previousMark = assignment.mark;
    const wasPublished = thesis.resultPublished;
    assignment.markHistory.push({
      previousMark,
      newMark: mark,
      changedBy: req.user._id,
      reason,
    });
    assignment.mark = mark;
    assignment.markLocked = true;
    assignment.status = "mark_submitted";
    applyEvaluationCalculation(thesis);
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action: "MARK_UPDATED",
      previousValue: { position, mark: previousMark },
      newValue: { position, mark },
      user: req.user,
      reason,
    });
    if (wasPublished) {
      await recordAudit({
        thesis: thesis._id,
        action: "PUBLISHED_RESULT_CHANGED",
        previousValue: { resultPublished: true, finalMark: previousMark },
        newValue: { resultPublished: false, finalMark: thesis.finalMark },
        user: req.user,
        reason,
      });
    }
    res.json({ message: "Mark corrected and final mark recalculated", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not correct mark" });
  }
};

exports.publishStudentFeedback = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const feedback = String(req.body.feedback || "").trim();
    if (feedback.length < 5) {
      return res.status(400).json({ message: "Student feedback is required" });
    }
    thesis.studentFeedback = feedback;
    thesis.studentFeedbackPublished = true;
    thesis.studentFeedbackPublishedAt = new Date();
    await thesis.save();
    await createNotification({
      recipient: thesis.student,
      thesis: thesis._id,
      type: "student_feedback_published",
      title: "Thesis feedback available",
      message: "Approved thesis feedback is now available in your dashboard.",
      link: `/student/thesis/${thesis._id}`,
    });
    await recordAudit({
      thesis: thesis._id,
      action: "STUDENT_FEEDBACK_PUBLISHED",
      newValue: { feedback },
      user: req.user,
    });
    res.json({ message: "Student feedback published", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not publish student feedback" });
  }
};

exports.runReminders = async (req, res) => {
  try {
    const sent = await sendEvaluationReminders();
    res.json({ message: `${sent} evaluation reminder(s) processed`, sent });
  } catch (error) {
    res.status(500).json({ message: "Could not process reminders" });
  }
};

exports.recalculate = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const previous = {
      finalMark: thesis.finalMark,
      bestTwoMarks: thesis.bestTwoMarks,
      status: thesis.finalMarkStatus,
    };
    const result = applyEvaluationCalculation(thesis);
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action: "FINAL_MARK_RECALCULATED",
      previousValue: previous,
      newValue: {
        finalMark: result.finalMark,
        bestTwoMarks: result.bestTwoMarks,
      },
      user: req.user,
    });
    res.json({ message: result.finalMark == null ? "Final mark is pending" : "Final mark recalculated", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not recalculate final mark" });
  }
};

exports.approveFinalMark = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    if (thesis.finalMarkStatus !== "calculated" || !Number.isFinite(thesis.finalMark)) {
      return res.status(409).json({ message: "A calculated final mark is required before approval" });
    }
    thesis.finalMarkStatus = "approved";
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action: "FINAL_MARK_APPROVED",
      newValue: { finalMark: thesis.finalMark },
      user: req.user,
    });
    res.json({ message: "Final mark approved", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not approve final mark" });
  }
};

exports.publishResult = async (req, res) => {
  try {
    const thesis = await requireThesis(req.params.id, res);
    if (!thesis) return;
    const state = getEvaluationState(thesis);
    if (thesis.finalMarkStatus !== "approved" || !Number.isFinite(thesis.finalMark)) {
      return res.status(409).json({ message: "Approve a valid final mark before publication" });
    }
    if (thesis.supervisorRequest?.status !== "accepted") {
      return res.status(409).json({
        message: "The Supervisor assignment must be accepted before publication",
      });
    }
    if (!state.firstTwoReady || (state.thirdRequired && !state.thirdReady)) {
      return res.status(409).json({ message: "All required evaluations must be submitted" });
    }
    thesis.finalMarkStatus = "published";
    thesis.resultPublished = true;
    thesis.resultPublishedAt = new Date();
    thesis.resultPublishedBy = req.user._id;
    thesis.status = "completed";
    await thesis.save();
    await recordAudit({
      thesis: thesis._id,
      action: "RESULT_PUBLISHED",
      newValue: { finalMark: thesis.finalMark, publishedAt: thesis.resultPublishedAt },
      user: req.user,
    });
    const student = await User.findById(thesis.student);
    await createNotification({
      recipient: thesis.student,
      thesis: thesis._id,
      type: "result_published",
      title: "Final result published",
      message: `Your final result for ${thesis.title} has been published.`,
      link: `/student/thesis/${thesis._id}`,
    });
    try {
      await sendPublishedResultEmail({ student, thesis });
    } catch (error) {
      console.error("Result publication email failed:", error.message);
    }
    res.json({ message: "Result published successfully", thesis });
  } catch (error) {
    res.status(500).json({ message: "Could not publish result" });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid thesis ID" });
    }
    const logs = await AuditLog.find({ thesis: req.params.id })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Could not load audit history" });
  }
};
