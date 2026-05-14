const router = require("express").Router()

const admin = require("../controllers/adminController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")

router.get("/users",protect,allowRoles("admin"),admin.getUsers)
router.get("/stats",protect,allowRoles("admin"),admin.getDashboardStats)
router.get("/chart",protect,allowRoles("admin"),admin.getChartData)

// Pending thesis
router.get("/pending-thesis", protect, allowRoles("admin"), admin.getPendingThesis);

router.patch("/users/:id",protect,allowRoles("admin"),admin.changeRole)

router.delete("/users/:id", protect, allowRoles("admin"), admin.deleteUser);

// Thesis routes
router.get("/thesis", protect, allowRoles("admin"), admin.getAllThesis);
router.get("/thesis/:id",protect,allowRoles("admin"), admin.getSingleThesis);
router.delete("/thesis/:id", protect, allowRoles("admin"), admin.deleteThesis);

router.patch(
  "/users/:id/status",
  protect,
  allowRoles("admin"),
  admin.updateAccountStatus
);
router.get(
  "/submission-setting",
  protect,
  allowRoles("admin"),
  admin.getSubmissionSetting
);

router.patch(
  "/submission-setting",
  protect,
  allowRoles("admin"),
  admin.setSubmissionDeadline
);


module.exports = router