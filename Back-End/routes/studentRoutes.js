const router = require("express").Router()

const student = require("../controllers/studentController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")
const upload = require("../middleware/uploadMiddleware")

router.post(
  "/upload",
  protect,
  allowRoles("student"),
  student.checkSubmissionDeadline,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "aiReportPdf", maxCount: 1 },
    { name: "plagiarismReportPdf", maxCount: 1 },
  ]),
  student.uploadThesis
);


// router.post('/upload',
//   (req, res, next) => {
//     console.log('Content-Type:', req.headers['content-type']);
//     console.log('→ File:', req.file);
//     console.log('→ Body before multer:', req.body);
//     next();
//   },
//   upload.single('pdf'),
//   (req, res, next) => {
//     console.log('→ After multer - File:', req.file);
//     console.log('→ After multer - Body:', req.body);
//     next();
//   },
//   protect,
//   allowRoles("student"),
//   student.uploadThesis
// );


router.get("/my-thesis",
 protect,
 allowRoles("student"),
 student.myThesis
)

router.get(
  "/thesis/:id",
  protect,
  allowRoles("student"),
  student.getSingleThesis
);

router.get(
  "/thesis/:id/timeline",
  protect,
  allowRoles("student"),
  student.getThesisTimeline,
);

router.delete("/thesis/:id",
 protect,
 allowRoles("student"),
 student.deleteThesis
)

router.get(
  "/recent-thesis",
  protect,
  allowRoles("student"),
  student.recentThesisLibrary
);

router.get(
  "/submission-status",
  protect,
  allowRoles("student"),
  student.getStudentSubmissionStatus
);

// profile
router.get("/profile", protect, allowRoles("student"), student.getProfile);
router.patch("/profile", protect, allowRoles("student"), student.updateProfile);


module.exports = router
