const router = require("express").Router()

const evaluator = require("../controllers/evaluatorController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")

// router.get("/accepted",
//  protect,
//  allowRoles("evaluator"),
//  evaluator.getAccepted
// )

// router.post("/mark",
//  protect,
//  allowRoles("evaluator"),
//  evaluator.giveMark
// )

// first & second evaluator
router.post("/submit-mark", protect, allowRoles("evaluator"), evaluator.submitMark)

// third evaluator
router.post("/submit-third-mark", protect,   evaluator.submitThirdEvaluatorMark)


// get pending for third evaluator
router.get("/pending-third", protect, allowRoles("third_evaluator"), evaluator.getPendingThirdEvaluator)

// get all accepted theses
router.get("/accepted", protect, allowRoles("evaluator"), evaluator.getAccepted)


module.exports = router