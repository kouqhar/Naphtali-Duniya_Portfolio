const router = require("express").Router();

// Load middleware
const { auth } = require("../middleware/auth");

// Load controllers
const { login, logoutUser, logoutAllUsers } = require("../controllers/login");

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_login
// @desc  Authenticating and logging in users
// @access  Public
router.post("/", login);

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_login/logout
// @desc  Authenticating and logging out user
// @access  Private
router.post("/logout", auth, logoutUser);

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_login/logoutAll
// @desc  Authenticating and logging out all users
// @access  Private
router.post("/logout_users", auth, logoutAllUsers);

module.exports = router;
