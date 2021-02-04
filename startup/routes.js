const express = require("express");

// Load Routes
const home = require("../routes/home_route");
// Users route
const user_register = require("../routes/user_register_route");
const user_login = require("../routes/user_login_route");
const user_profile = require("../routes/user_profile_route");
const user_testimonial = require("../routes/user_testimonial_route");
// Super Admin route
const super_admin_register = require("../routes/super_admin_register_route");
const super_admin_login = require("../routes/super_admin_login_route");
const super_admin_profile = require("../routes/super_admin_profile_route");

// Load middleware
const error = require("../middleware/error");

module.exports = function (app) {
  // Add a middleware
  app.use(express.json());

  // Serve up static files
  app.use("/uploads", express.static("uploads"));

  // User routes
  app.use("/", home);
  app.use("/api/naphtali/duniya/portfolio/auth_u/user_register", user_register);
  app.use("/api/naphtali/duniya/portfolio/auth_u/user_login", user_login);
  app.use("/api/naphtali/duniya/portfolio/auth_u/user_profile", user_profile);
  app.use(
    "/api/naphtali/duniya/portfolio/auth_u/user_testimonial",
    user_testimonial
  );

  // // Super Admin routes
  app.use(
    "/api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register",
    super_admin_register
  );
  app.use(
    "/api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_login",
    super_admin_login
  );
  app.use(
    "/api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_profile",
    super_admin_profile
  );

  // Express Error handling middleware
  app.use(error);
};
