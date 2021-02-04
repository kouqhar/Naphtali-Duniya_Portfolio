const { info: winstonInfo } = require("winston");
const mongoose = require("mongoose");

// Load Models or config
const { gravatarId, gravatarNumbers } = require("../config/keys");
const {
  UserProfile,
  validateTestimonialText,
} = require("../models/User_Profile");
const { User } = require("../models/User_Register");
const { SuperAdminProfile } = require("../models/SuperAdmin_Profile");

const getProfiles = async (req, res) => {
  const { _id } = req.user;
  const strArr = gravatarId.split("-");
  const id = gravatarNumbers.map((number) => strArr[number]).join("");

  const superAdminProfile = await SuperAdminProfile.findOne({ user: id });
  const user = await User.findOne({ _id });
  if (!user)
    return res
      .status(404)
      .send({ Success: false, message: "No user found with  that ID!!!" });

  const userProfile = await UserProfile.findOne({ user: _id });
  if (!userProfile)
    return res.status(404).send({
      Success: false,
      message: "No user found with that ID, please create a profile!",
    });

  return { superAdminProfile, user, userProfile };
};

// Create a testimonial
const createTestimonial = async (req, res) => {
  const inputFields = Object.keys(req.body);
  const defaultId = mongoose.Types.ObjectId();
  const { _id } = req.user;

  // Check the default model validation
  // Return any errors with 400 status
  const { error } = validateTestimonialText(req.body);
  if (error) {
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });
  }

  try {
    const { superAdminProfile, user, userProfile } = await getProfiles(
      req,
      res
    );

    // De-structured fields
    const { avatar, name } = user;
    const { handle, company, location } = userProfile;

    // Store fields
    const userTestimonialField = {
      user: _id,
      defaultId,
    };

    const superAdminTestimonialField = {
      user: {
        user: _id,
        avatar,
        name,
        handle,
        company,
        location,
      },
      defaultId,
    };

    inputFields.forEach((field) => {
      if (field) {
        userTestimonialField[field] = req.body[field];
        superAdminTestimonialField[field] = req.body[field];
      }
    });

    userProfile.testimonial.unshift(userTestimonialField);
    superAdminProfile.testimonials.push(superAdminTestimonialField);

    const saveUserTestimonial = userProfile.save();
    const saveSuperAdminTestimonial = superAdminProfile.save();
    if (!saveUserTestimonial || !saveSuperAdminTestimonial)
      return res.status(500).send({
        Success: false,
        message: "Unable to save testimonial to the database!!!",
      });

    res.send({ Success: true, Testimonial: userTestimonialField });
  } catch (error) {
    const errorMessage = `Creating testimonial error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Update a testimonial
const updateTestimonial = async (req, res) => {
  const inputFields = Object.keys(req.body);
  const { testimonial_id } = req.params;

  // Check the default model validation
  // Return any errors with 400 status
  const { error } = validateTestimonialText(req.body);
  if (error) {
    return res
      .status(400)
      .send({ Success: false, message: error.details[0].message });
  }

  try {
    const { superAdminProfile, userProfile } = await getProfiles(req, res);

    const userTestimonialIndex = userProfile["testimonial"]
      .map((testimonial) => testimonial._id)
      .indexOf(testimonial_id);

    const foundUserTestimonial = userProfile.testimonial[userTestimonialIndex];
    if (userTestimonialIndex < 0)
      return res
        .status(404)
        .send({ Success: false, message: "Unable to find testimonial" });
    if (foundUserTestimonial.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .send({ Success: false, message: "Unable to update this testimonial" });

    const update = {
      update: foundUserTestimonial.testimonial_text,
    };

    const foundTestimonialSuperAdminIndex = superAdminProfile.testimonials
      .map((testimonial) => testimonial.defaultId)
      .indexOf(foundUserTestimonial.defaultId);
    const foundTestimonialSuperAdmin =
      superAdminProfile.testimonials[foundTestimonialSuperAdminIndex];

    inputFields.forEach((field) => {
      if (field) {
        foundUserTestimonial[field] = req.body[field];
        foundTestimonialSuperAdmin[field] = req.body[field];
      }
    });
    if (!foundUserTestimonial.edited || !foundTestimonialSuperAdmin.edited) {
      foundUserTestimonial.edited = true;
      foundTestimonialSuperAdmin.edited = true;
    }
    foundUserTestimonial.dateUpdated.unshift(update);

    const saveUserTestimonial = userProfile.save();
    const saveSuperAdminTestimonial = superAdminProfile.save();
    if (!saveUserTestimonial || !saveSuperAdminTestimonial)
      return res.status(500).send({
        Success: false,
        message: "Unable to save testimonial to the database!!!",
      });

    res.send({ Success: true, "Updated Testimonial": foundUserTestimonial });
  } catch (error) {
    const errorMessage = `Updating testimonial error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Delete a testimonial
const deleteTestimonial = async (req, res) => {
  const { testimonial_id } = req.params;

  // Update the fields if the profile is true
  try {
    const { superAdminProfile, userProfile } = await getProfiles(req, res);
    const testimonialIndex = userProfile["testimonial"]
      .map((testimonial) => testimonial._id)
      .indexOf(testimonial_id);

    const foundUserTestimonial = userProfile.testimonial[testimonialIndex];
    if (testimonialIndex < 0)
      return res
        .status(404)
        .send({ Success: false, message: "Unable to find testimonial" });
    if (foundUserTestimonial.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .send({ Success: false, message: "Unable to delete this testimonial" });

    const foundTestimonialSuperAdminIndex = superAdminProfile.testimonials
      .map((testimonial) => testimonial.defaultId)
      .indexOf(foundUserTestimonial.defaultId);

    const removedUserTestimonial = userProfile.testimonial.splice(
      testimonialIndex,
      1
    )[0];
    const removedSuperAdminTestimonial = superAdminProfile.testimonials.splice(
      foundTestimonialSuperAdminIndex,
      1
    )[0];
    const history = {
      user: {
        ...removedUserTestimonial,
      },
      superAdmin: {
        ...removedSuperAdminTestimonial,
      },
    };
    superAdminProfile.history.unshift(history);

    const saveUserTestimonial = userProfile.save();
    const saveSuperAdminTestimonial = superAdminProfile.save();
    if (!saveUserTestimonial || !saveSuperAdminTestimonial)
      return res.status(500).send({
        Success: false,
        message: "Unable to save testimonial to the database!!!",
      });

    res.send({ Success: true, "Deleted Testimonial": removedUserTestimonial });
  } catch (error) {
    const errorMessage = `Deleting testimonial error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = { createTestimonial, updateTestimonial, deleteTestimonial };
