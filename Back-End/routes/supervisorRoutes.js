const router = require("express").Router()

const supervisor = require("../controllers/supervisorController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")

router.get("/thesis",
 protect,
 allowRoles("supervisor"),
 supervisor.getAllThesis
)

router.patch("/review",
 protect,
 allowRoles("supervisor"),
 supervisor.reviewThesis
)

module.exports = router