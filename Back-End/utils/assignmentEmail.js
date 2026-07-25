const { sendEmail } = require("./mailer");

const clientUrl = () =>
  (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")[0]
    .trim()
    .replace(/\/+$/, "");

const assignmentRoleLabel = (position) =>
  position ? `${["First", "Second", "Third"][position - 1]} Evaluator` : "Supervisor";

const sendAssignmentEmail = async ({
  user,
  thesis,
  position,
  deadline,
  reassigned = false,
}) => {
  const role = assignmentRoleLabel(position);
  const dashboardPath = position ? "/evaluator" : "/supervisor";
  const assignedAt = new Date().toLocaleString("en-GB");
  const deadlineText = deadline
    ? new Date(deadline).toLocaleString("en-GB")
    : "Not specified";

  return sendEmail({
    to: user.email,
    subject: `${reassigned ? "Reassignment" : "New assignment"}: ${role}`,
    text: [
      `You have been assigned as ${role}.`,
      `Project ID: ${thesis._id}`,
      `Thesis: ${thesis.title}`,
      `Student: ${thesis.student?.name || "Student"}`,
      `Assigned: ${assignedAt}`,
      `Deadline: ${deadlineText}`,
      `Open: ${clientUrl()}${dashboardPath}`,
      "Please sign in and accept or reject this assignment.",
    ].join("\n"),
    html: `<h2>${role} assignment</h2>
      <p>You have been assigned as <strong>${role}</strong>.</p>
      <p><strong>Project ID:</strong> ${thesis._id}<br>
      <strong>Thesis:</strong> ${thesis.title}<br>
      <strong>Student:</strong> ${thesis.student?.name || "Student"}<br>
      <strong>Assigned:</strong> ${assignedAt}<br>
      <strong>Deadline:</strong> ${deadlineText}</p>
      <p><a href="${clientUrl()}${dashboardPath}">Open your dashboard</a> to accept or reject the assignment.</p>`,
  });
};

const sendPublishedResultEmail = ({ student, thesis }) =>
  sendEmail({
    to: student.email,
    subject: `Thesis result published: ${thesis.title}`,
    text: `Your thesis final result has been published. Sign in to your student dashboard to view it.`,
    html: `<p>Your final result for <strong>${thesis.title}</strong> has been published.</p><p><a href="${clientUrl()}/student">Open Student Dashboard</a></p>`,
  });

module.exports = { sendAssignmentEmail, sendPublishedResultEmail };
