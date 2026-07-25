const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = (data) => Notification.create(data);

const notifyAdmins = async ({ thesis, type, title, message, link }) => {
  const admins = await User.find({
    role: "admin",
    status: "active",
    isActive: true,
  }).select("_id");
  if (!admins.length) return [];
  return Notification.insertMany(
    admins.map((admin) => ({
      recipient: admin._id,
      thesis,
      type,
      title,
      message,
      link,
    })),
  );
};

module.exports = { createNotification, notifyAdmins };
