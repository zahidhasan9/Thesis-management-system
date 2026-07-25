const Thesis = require("../models/Thesis");
const User = require("../models/User");
const { sendEmail } = require("./mailer");
const { createNotification } = require("./notifications");

const REMINDER_WINDOW = 24 * 60 * 60 * 1000;

const sendEvaluationReminders = async () => {
  const now = new Date();
  const upcoming = new Date(Date.now() + REMINDER_WINDOW);
  const cooldown = new Date(Date.now() - REMINDER_WINDOW);
  const theses = await Thesis.find({
    evaluatorAssignments: {
      $elemMatch: {
        deadline: { $lte: upcoming },
        status: { $in: ["pending", "accepted", "evaluation_pending"] },
        $or: [
          { reminderSentAt: { $exists: false } },
          { reminderSentAt: { $lt: cooldown } },
        ],
      },
    },
  }).populate("student", "name");

  let sent = 0;
  for (const thesis of theses) {
    for (const assignment of thesis.evaluatorAssignments) {
      if (
        !assignment.deadline ||
        assignment.deadline > upcoming ||
        !["pending", "accepted", "evaluation_pending"].includes(
          assignment.status,
        ) ||
        (assignment.reminderSentAt && assignment.reminderSentAt >= cooldown)
      ) {
        continue;
      }
      const evaluator = await User.findById(assignment.evaluator);
      if (!evaluator) continue;
      const overdue = assignment.deadline < now;
      const message = `${thesis.title} evaluation is ${
        overdue ? "overdue" : "due soon"
      } (${assignment.deadline.toLocaleString("en-GB")}).`;
      await createNotification({
        recipient: evaluator._id,
        thesis: thesis._id,
        type: overdue ? "evaluation_overdue" : "evaluation_due",
        title: overdue ? "Evaluation overdue" : "Evaluation due soon",
        message,
        link: `/evaluator/thesis/${thesis._id}`,
      });
      try {
        await sendEmail({
          to: evaluator.email,
          subject: `${overdue ? "Overdue" : "Reminder"}: ${thesis.title}`,
          text: message,
          html: `<p>${message}</p>`,
        });
      } catch (error) {
        console.error("Evaluation reminder email failed:", error.message);
      }
      assignment.reminderSentAt = new Date();
      sent += 1;
    }
    await thesis.save();
  }
  return sent;
};

module.exports = { sendEvaluationReminders };
