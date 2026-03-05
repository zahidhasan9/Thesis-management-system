const router = require("express").Router()

const evaluator = require("../controllers/evaluatorController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")

router.get("/accepted",
 protect,
 allowRoles("evaluator"),
 evaluator.getAccepted
)

router.post("/mark",
 protect,
 allowRoles("evaluator"),
 evaluator.giveMark
)

module.exports = router