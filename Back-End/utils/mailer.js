const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort === 587,
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getFromAddress = () => {
  const name = process.env.SMTP_FROM_NAME || "PermisGo Auto";
  const email = process.env.SMTP_FROM_EMAIL;

  if (!email) {
    throw new Error("SMTP_FROM_EMAIL is missing from environment variables");
  }

  return `"${name.replace(/"/g, "")}" <${email}>`;
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Brevo SMTP credentials are not configured");
  }

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
    replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM_EMAIL,
  });
};

const verifyMailer = async () => transporter.verify();

module.exports = {
  sendEmail,
  verifyMailer,
};
