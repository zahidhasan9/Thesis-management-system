const AuditLog = require("../models/AuditLog");

const recordAudit = async ({
  thesis,
  action,
  previousValue,
  newValue,
  user,
  reason,
}) =>
  AuditLog.create({
    thesis,
    action,
    previousValue,
    newValue,
    performedBy: user._id,
    performedByRole: user.role,
    reason,
  });

module.exports = { recordAudit };
