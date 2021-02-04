const router = require("express").Router();

// Load middleware
const { authSuperAdmin } = require("../middleware/auth");

// Load Controllers
const {
  currentSuperAdmin,
  registerSuperAdmin,
  forgotSuperAdminPassword,
  resetSuperAdminPassword,
} = require("../controllers/super_admin_register");

// @route   GET /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register/:adminName
// @desc    Get current admin
// @access  Private
router.get("/:superAdminName", authSuperAdmin, currentSuperAdmin);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register
// @desc    Register a new admin
// @access  Public
router.post("/", registerSuperAdmin);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register/super_admin_forgot_password
// @desc  Sending reset link to the admin via email
// @access  Public
router.post("/super_admin_forgot_password", forgotSuperAdminPassword);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register/reset_super_admin_password/:token
// @desc  Resetting admins password via email
// @access  Public
router.post("/reset_super_admin_password/:token", resetSuperAdminPassword);

module.exports = router;
