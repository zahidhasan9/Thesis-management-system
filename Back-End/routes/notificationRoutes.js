const router = require("express").Router();
const notification = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, notification.getNotifications);
router.patch("/read-all", protect, notification.markAllRead);
router.patch("/:id/read", protect, notification.markRead);

module.exports = router;
