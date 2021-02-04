const _ = require("lodash");
const { url } = require("gravatar");
const { genSalt, hash } = require("bcrypt");
const { info: winstonInfo, error: winstonError } = require("winston");
const { isJWT, isEmail, equals } = require("validator");
const { verify } = require("jsonwebtoken");

// Load mailer and model
const { secretOrKey } = require("../config/keys");
const {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendInformResetPasswordEmail,
} = require("../emails/account");
const {
  validateUser,
  User,
  validateResetPassword,
} = require("../models/User_Register");

// Get the current user
const currentUser = async (req, res) => {
  try {
    if (req.user.name !== req.params.userName)
      return res
        .status(404)
        .send({ Success: false, message: "No user with that name found!!!" });

    const user = await User.findOne({ _id: req.user._id }).select("-password");
    if (!user)
      return res
        .status(404)
        .send({ Success: false, message: "No user found with that ID!" });

    res.send({ Success: true, User: user });
  } catch (error) {
    const errorMessage = `Getting current user error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { email } = req.body;

  // Validate user input fields
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });

  // Confirm user has no account already
  let user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .send({ Success: false, message: "Email already registered!" });

  const avatar = url(email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm", // Default
  });

  try {
    // Create a new user after basic validation
    const createUser = _.pick(req.body, ["name", "email", "password"]);
    user = new User(createUser);

    // Encrypt, hash and save password
    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    user.avatar = avatar;

    // Save database
    await user.save();

    // Generate random and unique token for further account validation
    const userDetails = _.pick(user, ["name", "email", "avatar"]);
    const token = await user.generateAuthToken();

    // Send email address
    sendWelcomeEmail(user);
    res.status(201).send({ Success: true, User: userDetails, Token: token });
  } catch (error) {
    const errorMessage = `User registration error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate if email input is a valid email address
  const isValidEmail = isEmail(email);
  if (!isValidEmail)
    return res
      .status(400)
      .send({ Success: false, message: "Invalid email address" });

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(404).send({
        Success: false,
        message: "There is no user found with that email.",
      });

    const token = await user.generateAuthToken();

    // Send an email reset link to the user
    sendResetPasswordEmail(user, token);
    setTimeout(
      () =>
        console.log({
          Success: true,
          message: "Email reset link sent to " + email,
        }),
      2000
    );
    res.send({ user, token });
  } catch (error) {
    const errorMessage = `Error sending forgotten password link ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Resetting your password
const resetPassword = async (req, res) => {
  const { new_password, confirm_password } = req.body;
  const { token } = req.params;

  const isValidJwt = isJWT(token);
  if (!isValidJwt)
    return res.status(406).send({
      Success: false,
      message: "Reset password invalid json web token!!!",
    });

  // Validate the input body field
  const { error } = validateResetPassword(req.body);
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
    const decoded = verify(token, secretOrKey);
    if (!decoded)
      return res
        .status(403)
        .send({ Success: false, message: "Unable to verify used token." });

    let user = await User.findOne({ _id: decoded._id });
    if (!user)
      return res.status(404).send({
        Success: false,
        message: "Unable to find user to reset password.",
      });

    // Hash and save the new password
    const salt = await genSalt(10);
    user.password = await hash(new_password, salt);
    user.tokens = [];

    delete req.header("Authorization");
    await user.save();

    setTimeout(() => {
      sendInformResetPasswordEmail(user);
      res.send({
        Success: true,
        message:
          "Password reset successful, you have been logged out on all devices.",
      });
    }, 3000);
  } catch (error) {
    const errorMessage = `Resetting password error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = { currentUser, registerUser, forgotPassword, resetPassword };
