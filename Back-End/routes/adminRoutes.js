const router = require("express").Router()

const admin = require("../controllers/adminController")

const {protect} = require("../middleware/authMiddleware")
const {allowRoles} = require("../middleware/roleMiddleware")

router.get("/users",protect,allowRoles("admin"),admin.getUsers)

router.patch("/role",protect,allowRoles("admin"),admin.changeRole)

router.delete("/user/:id",protect,allowRoles("admin"),admin.deleteUser)

module.exports = router