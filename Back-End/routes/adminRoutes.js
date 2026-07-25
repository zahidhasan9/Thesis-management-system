const router = require("express").Router()

const admin = require("../controllers/adminController")
const evaluationAdmin = require("../controllers/evaluationAdminController")

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
router.get("/eligible-staff", protect, allowRoles("admin"), evaluationAdmin.getEligibleStaff);
router.get("/thesis/:id",protect,allowRoles("admin"), admin.getSingleThesis);
router.patch("/thesis/:id/assign-reviewers", protect, allowRoles("admin"), evaluationAdmin.assignCoreTeam);
router.patch("/thesis/:id/require-third", protect, allowRoles("admin"), evaluationAdmin.requireThirdEvaluator);
router.patch("/thesis/:id/assign-third", protect, allowRoles("admin"), evaluationAdmin.assignThirdEvaluator);
router.post("/thesis/:id/resend-assignment", protect, allowRoles("admin"), evaluationAdmin.resendAssignmentEmail);
router.patch("/thesis/:id/marks/:position/unlock", protect, allowRoles("admin"), evaluationAdmin.unlockMark);
router.patch("/thesis/:id/marks/:position/correct", protect, allowRoles("admin"), evaluationAdmin.correctMark);
router.post("/thesis/:id/recalculate", protect, allowRoles("admin"), evaluationAdmin.recalculate);
router.patch("/thesis/:id/approve", protect, allowRoles("admin"), evaluationAdmin.approveFinalMark);
router.patch("/thesis/:id/publish", protect, allowRoles("admin"), evaluationAdmin.publishResult);
router.get("/thesis/:id/audit", protect, allowRoles("admin"), evaluationAdmin.getAuditLog);
router.patch("/thesis/:id/student-feedback", protect, allowRoles("admin"), evaluationAdmin.publishStudentFeedback);
router.post("/evaluation-reminders/run", protect, allowRoles("admin"), evaluationAdmin.runReminders);
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
