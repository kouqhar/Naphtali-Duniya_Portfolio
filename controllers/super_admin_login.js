const { compare } = require("bcrypt");
const { error: winstonError, info: winstonInfo } = require("winston");

const {
  validateSuperAdminLogin,
  SuperAdmin,
} = require("../models/SuperAdmin_Register");

// Login to your account
const login = async (req, res) => {
  const { email: userEmail, password: userPassword } = req.body;

  // Validate the user credentials
  const { error } = validateSuperAdminLogin(req.body);
  if (error)
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });

  try {
    // Find super admin, validate credentials,
    // or return error if account is not verified
    let superAdmin = await SuperAdmin.findOne({ email: userEmail });
    if (!superAdmin)
      return res
        .status(400)
        .send({ Success: false, message: "Invalid Email or password." });

    // Compare and validate user input and stored credential
    const validatePassword = await compare(userPassword, superAdmin.password);
    if (!validatePassword)
      return res
        .status(400)
        .send({ Success: false, message: "Invalid Email or password." });

    const { isAdmin, isSuperAdmin } = superAdmin;
    if (!isAdmin || !isSuperAdmin)
      return res.status(401).send({
        Success: false,
        message: "Unable to sign you in as a super admin!!!",
      });

    // Implementation of json web token
    const token = await superAdmin.generateAuthToken();
    res.header("Authorization", token).send({ token });
  } catch (error) {
    const errorMessage = `Login error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Logout off the current session only
const logoutSuperAdmin = async (req, res) => {
  try {
    // Filter through all stored tokens
    // And leave others, deleting only the current session
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    delete res.header("Authorization") === req.token;

    // Save database
    await req.user.save();

    res.send({ Success: true, message: "Super admin logged out" });
  } catch (error) {
    const errorMessage = `Unable to log super admin out error : ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Logout off all sessions except the current session
const logoutAllSuperAdmin = async (req, res) => {
  try {
    // Filter through all stored tokens
    // And delete others, leaving only the current session
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token === req.token
    );

    // Save database
    await req.user.save();

    res.send({ Success: true, message: "Super admins logged out" });
  } catch (error) {
    const errorMessage = `Unable to log super admins out error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = {
  login,
  logoutSuperAdmin,
  logoutAllSuperAdmin,
};
