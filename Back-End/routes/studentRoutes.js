const router = require("express").Router()

const student = require("../controllers/studentController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")
const upload = require("../middleware/uploadMiddleware")

router.post("/upload",
 protect,
 allowRoles("student"),
 upload.single("pdf"),
 student.uploadThesis
)


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

router.delete("/thesis/:id",
 protect,
 allowRoles("student"),
 student.deleteThesis
)

module.exports = router