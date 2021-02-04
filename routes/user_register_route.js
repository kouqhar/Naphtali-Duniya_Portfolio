const router = require("express").Router();

// Load middleware
const { auth } = require("../middleware/auth");

// Load Controllers
const {
  currentUser,
  registerUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/user_register");

// @route   GET /api/naphtali/duniya/portfolio/auth_u/user_register/:userName
// @desc    Get current user
// @access  Private
router.get("/:userName", auth, currentUser);

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_register
// @desc    Register a new user
// @access  Public
router.post("/", registerUser);

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_forgot_password
// @desc  Sending reset link to the user via email
// @access  Public
router.post("/user_forgot_password", forgotPassword);

// @route   POST /api/naphtali/duniya/portfolio/auth_u/reset_user_password/:token
// @desc  Resetting users password via email
// @access  Public
router.post("/reset_user_password/:token", resetPassword);

module.exports = router;
