const router = require("express").Router();

// Load Middleware
const { auth } = require("../middleware/auth");
const { isUser } = require("../middleware/isUserMiddleware");

// Load Controllers
const { getMyProfile, createProfile } = require("../controllers/user_profile");

// @route   GET /api/naphtali/duniya/portfolio/auth_u/user_profile
// @desc    Get Current user's profile
// @access  Private
router.get("/", auth, getMyProfile);

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_profile
// @desc    Create or edit user profile
// @access  Private
router.post("/", [auth, isUser], createProfile);

module.exports = router;
