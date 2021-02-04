const router = require("express").Router();

// Load Middleware
const { auth } = require("../middleware/auth");
const { isUserProfile } = require("../middleware/isUserMiddleware");

// Load Controllers
const {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/user_testimonial");

// @route   POST /api/naphtali/duniya/portfolio/auth_u/user_testimonial/create_testimonial
// @desc    Create or edit user profile
// @access  Private
router.post("/create_testimonial", [auth, isUserProfile], createTestimonial);

// @route   PUT /api/naphtali/duniya/portfolio/auth_u/user_testimonial/update_testimonial/:testimonial_id
// @desc    Update user testimonial
// @access  Private
router.put(
  "/update_testimonial/:testimonial_id",
  [auth, isUserProfile],
  updateTestimonial
);

// @route   DELETE /api/naphtali/duniya/portfolio/auth_u/user_testimonial/delete_testimonial/:testimonial_id
// @desc    Delete user testimonial
// @access  Private
router.delete(
  "/delete_testimonial/:testimonial_id",
  [auth, isUserProfile],
  deleteTestimonial
);

module.exports = router;
