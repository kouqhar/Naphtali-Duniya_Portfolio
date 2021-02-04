const { UserProfile } = require("../models/User_Profile");
const { info: winstonInfo } = require("winston");

// load custom validation
const { validateProfileInput } = require("../validation/profile");

// Return the current profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user._id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(404)
        .send({ Success: false, message: "There is no Profile for that user" });
    }
    res.send({ Success: true, Profile: profile });
  } catch (error) {
    const errorMessage = `Getting current profile error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Create your profile
const createProfile = async (req, res) => {
  const inputFields = Object.keys(req.body);

  // Check the validation
  // Return any errors with 400 status
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).send({ Success: false, message: errors });
  }

  // Get fields
  const profileFields = {
    user: req.user._id,
  };

  inputFields.forEach((field) => {
    if (field) profileFields[field] = req.body[field];
  });

  // Social
  profileFields.social = {};
  inputFields.forEach((social) => {
    if (social) profileFields.social[social] = req.body[social];
  });

  // Update the fields if the profile is true
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      // Check if the handle exists
      const createProfile = await UserProfile.findOne({
        handle: profileFields.handle,
      });
      if (createProfile) {
        errors.handle = "That handle already exists";
        return res.status(400).send({ Success: false, message: errors });
      }

      // Save Profile if it doesn't exist
      const savedProfile = await new UserProfile(profileFields).save();
      if (!savedProfile)
        return res
          .status(500)
          .send({ Success: false, message: "Unable to save new profile!" });
      return res.send({ Success: true, Profile: profileFields });
    }

    // Update profile
    const updateProfile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
    if (!updateProfile)
      return res.status(404).send({
        Success: false,
        message: "No user found to create profile for!",
      });

    res.send({ Success: true, Profile: profileFields });
  } catch (error) {
    const errorMessage = `Creating or Updating profile error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = {
  getMyProfile,
  createProfile,
};
