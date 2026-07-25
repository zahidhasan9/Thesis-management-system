const router = require("express").Router()

const supervisor = require("../controllers/supervisorController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")

router.get("/thesis",
 protect,
 allowRoles("supervisor", "evaluator", "third_evaluator"),
 supervisor.getAllThesis
)

router.patch("/review",
 protect,
 allowRoles("supervisor", "evaluator", "third_evaluator"),
 supervisor.reviewThesis
)

router.get("/thesis/:id", protect,
    allowRoles("supervisor", "evaluator", "third_evaluator"), 
    supervisor.getSingleThesis);

// Get supervisor profile
router.get("/profile", protect, allowRoles("supervisor", "evaluator", "third_evaluator"),  supervisor.getProfile);

// Update supervisor profile
router.patch("/profile", protect, allowRoles("supervisor", "evaluator", "third_evaluator"), supervisor.updateProfile);



module.exports = router
