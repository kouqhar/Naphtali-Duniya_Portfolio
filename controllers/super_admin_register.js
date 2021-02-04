const _ = require("lodash");
const { url } = require("gravatar");
const { genSalt, hash } = require("bcrypt");
const { info: winstonInfo, error: winstonError } = require("winston");
const { isJWT, isEmail, equals } = require("validator");
const { verify } = require("jsonwebtoken");

// Load mailer and model
const { secretOrSuperAdminKey } = require("../config/keys");
const {
  sendSuperAdminWelcomeEmail,
  sendSuperAdminResetPasswordEmail,
  sendSuperAdminInformResetPasswordEmail,
} = require("../emails/account");
const {
  SuperAdmin,
  validateSuperAdmin,
  validateSuperAdminResetPassword,
} = require("../models/SuperAdmin_Register");

// Get the current user
const currentSuperAdmin = async (req, res) => {
  const { _id } = req.user;
  try {
    if (req.user.name !== req.params.superAdminName)
      return res.status(404).send({
        Success: false,
        message: "No super admin with that name found!!!",
      });

    const superAdmin = await SuperAdmin.findOne({
      _id,
      isAdmin: true,
      isSuperAdmin: true,
    }).select("-password");
    if (!superAdmin)
      return res.status(404).send({
        Success: false,
        message: "No Super Admin found with that ID!",
      });

    res.send({ Success: true, "Super Admin": superAdmin });
  } catch (error) {
    const errorMessage = `Getting current super admin error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Register a new user
const registerSuperAdmin = async (req, res) => {
  const { email } = req.body;

  // Validate user input fields
  const { error } = validateSuperAdmin(req.body);
  if (error)
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });

  // Confirm user has no account already
  let superAdmin = await SuperAdmin.findOne({ email });
  if (superAdmin)
    return res
      .status(400)
      .send({ Success: false, message: "Email already registered!" });

  const avatar = url(email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm", // Default
  });

  try {
    // Create a new superAdmin after basic validation
    const createSuperAdmin = _.pick(req.body, ["name", "email", "password"]);
    superAdmin = new SuperAdmin(createSuperAdmin);

    // Encrypt, hash and save password
    const salt = await genSalt(10);
    superAdmin.password = await hash(superAdmin.password, salt);
    superAdmin.avatar = avatar;

    // Save database
    await superAdmin.save();

    // Generate random and unique token for further account validation
    const superAdminDetails = _.pick(superAdmin, [
      "name",
      "email",
      "avatar",
      "isAdmin",
      "isSuperAdmin",
    ]);
    const token = await superAdmin.generateAuthToken();

    // Send email address
    sendSuperAdminWelcomeEmail(superAdmin);
    res
      .status(201)
      .send({ Success: true, "Super Admin": superAdminDetails, Token: token });
  } catch (error) {
    const errorMessage = `Super Admin registration error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Forgot password
const forgotSuperAdminPassword = async (req, res) => {
  const { email } = req.body;

  // Validate if email input is a valid email address
  const isValidEmail = isEmail(email);
  if (!isValidEmail)
    return res
      .status(400)
      .send({ Success: false, message: "Invalid email address" });

  try {
    let superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin)
      return res.status(404).send({
        Success: false,
        message: "There is no super admin found with that email.",
      });

    const token = await superAdmin.generateAuthToken();

    // Send an email reset link to the user
    sendSuperAdminResetPasswordEmail(superAdmin, token);
    setTimeout(
      () =>
        console.log({
          Success: true,
          message: "Email reset link sent to " + email,
        }),
      2000
    );
    res.send({ "Super Admin": superAdmin, token });
  } catch (error) {
    const errorMessage = `Error sending super admin forgotten password link ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Resetting your password
const resetSuperAdminPassword = async (req, res) => {
  const { new_password, confirm_password } = req.body;
  const { token } = req.params;

  const isValidJwt = isJWT(token);
  if (!isValidJwt)
    return res.status(406).send({
      Success: false,
      message: "Reset password invalid json web token!!!",
    });

  // Validate the input body field
  const { error } = validateSuperAdminResetPassword(req.body);
  if (error)
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });

  // Check if both input passwords match
  const passwordMatch = equals(confirm_password, new_password);
  if (!passwordMatch)
    return res
      .status(400)
      .send({ Success: false, message: "Passwords do not match!" });

  try {
    const decoded = verify(token, secretOrSuperAdminKey);
    if (!decoded)
      return res
        .status(403)
        .send({ Success: false, message: "Unable to verify used token." });

    let superAdmin = await SuperAdmin.findOne({ _id: decoded._id });
    if (!superAdmin)
      return res.status(404).send({
        Success: false,
        message: "Unable to find super admin to reset password.",
      });

    // Hash and save the new password
    const salt = await genSalt(10);
    superAdmin.password = await hash(new_password, salt);
    superAdmin.tokens = [];

    delete req.header("Authorization");
    await superAdmin.save();

    setTimeout(() => {
      sendSuperAdminInformResetPasswordEmail(superAdmin);
      res.send({
        Success: true,
        message:
          "Password reset successful, you have been logged out on all devices.",
      });
    }, 3000);
  } catch (error) {
    const errorMessage = `Resetting super admin password error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = {
  currentSuperAdmin,
  registerSuperAdmin,
  forgotSuperAdminPassword,
  resetSuperAdminPassword,
};
