const { User } = require("../models/User_Register");
const { UserProfile } = require("../models/User_Profile");
const { error: winstonError } = require("winston");

// Check if id is present
const isUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user)
      return res
        .status(404)
        .send({ Success: false, errorMessage: "No user with that ID found!" });

    next();
  } catch (error) {
    const errorMessage = `Is User middleware error ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Check if profile is created
const isProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile)
      return res.status(404).send({
        Success: false,
        errorMessage: "No profile found for that profile",
      });

    next();
  } catch (error) {
    const errorMessage = `Is Profile middleware error ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Check if user and profile are true
const isUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user)
      return res
        .status(404)
        .send({ Success: false, message: "No user with that ID found!" });

    const profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile)
      return res
        .status(404)
        .send({ Success: false, message: "No profile found for that user" });

    next();
  } catch (error) {
    const errorMessage = `User-Profile middleware error ${error}`;
    winstonError(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = { isUser, isProfile, isUserProfile };
