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

router.get("/thesis/:id", protect,
    allowRoles("supervisor"), 
    supervisor.getSingleThesis);

// Get supervisor profile
router.get("/profile", protect, allowRoles("supervisor"),  supervisor.getProfile);

// Update supervisor profile
router.patch("/profile", protect, allowRoles("supervisor"), supervisor.updateProfile);



module.exports = router