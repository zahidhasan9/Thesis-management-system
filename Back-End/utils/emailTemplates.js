const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const baseTemplate = ({
  title,
  greeting,
  message,
  buttonText,
  buttonUrl,
  note,
}) => {
  const safeTitle = escapeHtml(title);
  const safeGreeting = escapeHtml(greeting);
  const safeMessage = escapeHtml(message);
  const safeButtonText = escapeHtml(buttonText);
  const safeButtonUrl = escapeHtml(buttonUrl);
  const safeNote = escapeHtml(note);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
</head>
<body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f3f4f6;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:24px 32px;background:#0f172a;color:#ffffff;">
              <div style="font-size:22px;font-weight:700;">nstu.edu.bd</div>
              <div style="font-size:13px;margin-top:4px;color:#cbd5e1;">Thesis Management System</div>
            </td>
          </tr>
          <tr>
            <td style="padding:34px 32px;">
              <h1 style="margin:0 0 18px;font-size:25px;line-height:1.3;">${safeTitle}</h1>
              <p style="margin:0 0 12px;font-size:16px;line-height:1.7;">${safeGreeting}</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">${safeMessage}</p>

              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:8px;background:#2563eb;">
                    <a href="${safeButtonUrl}" target="_blank" rel="noopener noreferrer"
                      style="display:inline-block;padding:13px 22px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">
                      ${safeButtonText}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:26px 0 8px;font-size:13px;line-height:1.6;color:#6b7280;">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="margin:0;word-break:break-all;font-size:13px;line-height:1.6;color:#2563eb;">
                ${safeButtonUrl}
              </p>

              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">
                ${safeNote}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#f8fafc;font-size:12px;line-height:1.6;color:#64748b;">
              This is an automated security email. Please do not share this link with anyone.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const verificationEmailTemplate = ({ name, verificationUrl }) => ({
  subject: "Verify your nstu.edu.bd email",
  text: `Hello ${name}, verify your email by opening this link: ${verificationUrl}. The link expires in 24 hours.`,
  html: baseTemplate({
    title: "Verify your email address",
    greeting: `Hello ${name},`,
    message:
      "Thank you for registering. Verify your email address first. After verification, your account will remain pending until an administrator approves it.",
    buttonText: "Verify Email",
    buttonUrl: verificationUrl,
    note: "This verification link expires in 24 hours.",
  }),
});

const resetPasswordEmailTemplate = ({ name, resetUrl }) => ({
  subject: "Reset your nstu.edu.bd password",
  text: `Hello ${name}, reset your password by opening this link: ${resetUrl}. The link expires in 15 minutes. Ignore this email if you did not request it.`,
  html: baseTemplate({
    title: "Reset your password",
    greeting: `Hello ${name},`,
    message:
      "We received a request to reset your password. Use the secure button below to create a new password.",
    buttonText: "Reset Password",
    buttonUrl: resetUrl,
    note: "This reset link expires in 15 minutes. If you did not request a password reset, you can safely ignore this email.",
  }),
});

module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};
