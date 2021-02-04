const router = require("express").Router();
const { homepage } = require("../controllers/homepage");

// @route   GET /
// @desc    Home page
// @access  Public
router.get("/", homepage);

module.exports = router;
