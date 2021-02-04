const router = require("express").Router();

// Load middleware
const { authSuperAdmin } = require("../middleware/auth");

// Load controllers
const {
  login,
  logoutSuperAdmin,
  logoutAllSuperAdmin,
} = require("../controllers/super_admin_login");

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_login
// @desc  Authenticating and logging in super admin
// @access  Public
router.post("/", login);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_login/logout
// @desc  Authenticating and logging out super admin
// @access  Private
router.post("/logout_super_admin", authSuperAdmin, logoutSuperAdmin);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_login/logoutAll
// @desc  Authenticating and logging out all super admins
// @access  Private
router.post("/logout_super_admins", authSuperAdmin, logoutAllSuperAdmin);

module.exports = router;
