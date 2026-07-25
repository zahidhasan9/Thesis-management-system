const router = require("express").Router();
const publicResult = require("../controllers/publicResultController");
const {
  publicResultLimiter,
} = require("../middleware/authRateLimiters");

router.post("/results", publicResultLimiter, publicResult.lookupResults);

module.exports = router;
