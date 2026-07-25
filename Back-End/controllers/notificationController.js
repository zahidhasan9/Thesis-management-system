const mongoose = require("mongoose");
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("thesis", "title")
      .sort({ createdAt: -1 })
      .limit(limit);
    const unread = await Notification.countDocuments({
      recipient: req.user._id,
      readAt: null,
    });
    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ message: "Could not load notifications" });
  }
};

exports.markRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { readAt: new Date() },
      { new: true },
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Could not update notification" });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, readAt: null },
      { readAt: new Date() },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Could not update notifications" });
  }
};
