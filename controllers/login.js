const { compare } = require("bcrypt");
const { error: winstonError, info: winstonInfo } = require("winston");

const { validateLogin, User } = require("../models/User_Register");

// Login to your account
const login = async (req, res) => {
  const { email: userEmail, password: userPassword } = req.body;

  // Validate the user credentials
  const { error } = validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });

  try {
    // Find user, validate credentials,
    // or return error if account is not verified
    let user = await User.findOne({ email: userEmail });
    if (!user)
      return res
        .status(400)
        .send({ Success: false, message: "Invalid Email or password." });

    // Compare and validate user input and stored credential
    const validatePassword = await compare(userPassword, user.password);
    if (!validatePassword)
      return res
        .status(400)
        .send({ Success: false, message: "Invalid Email or password." });

    // Implementation of json web token
    const token = await user.generateAuthToken();
    res.header("Authorization", token).send({ token });
  } catch (error) {
    const errorMessage = `Login error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Logout off the current session only
const logoutUser = async (req, res) => {
  try {
    // Filter through all stored tokens
    // And leave others, deleting only the current session
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    delete res.header("Authorization") === req.token;

    // Save database
    await req.user.save();

    res.send({ Success: true, message: "User logged out" });
  } catch (error) {
    const errorMessage = `Unable to log user out error : ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Logout off all sessions except the current session
const logoutAllUsers = async (req, res) => {
  try {
    // Filter through all stored tokens
    // And delete others, leaving only the current session
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token === req.token
    );

    // Save database
    await req.user.save();

    res.send({ Success: true, message: "Users logged out" });
  } catch (error) {
    const errorMessage = `Unable to log users out error : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = {
  login,
  logoutUser,
  logoutAllUsers,
};
