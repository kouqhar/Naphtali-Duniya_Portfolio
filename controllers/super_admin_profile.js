const { info: winstonInfo } = require("winston");
const { access, mkdir } = require("fs");
const { join } = require("path");

// load Models and custom validation
const { validateProfileInput } = require("../validation/profile");
const { SuperAdminProfile } = require("../models/SuperAdmin_Profile");
const { SuperAdmin } = require("../models/SuperAdmin_Register");
const cloudinary = require("../utils/Cloudinary/cloudinary");

// Generating destinations to store user files/uploads
const diskStorageDestination = async (req, file, cb, folderName) => {
  const superAdmin = await SuperAdmin.findOne({
    _id: req.user._id,
    isAdmin: true,
    isSuperAdmin: true,
  });
  if (!superAdmin) {
    return res
      .status(404)
      .send({ Success: false, message: "No super admin found with that ID!" });
  }

  const superAdminProfile = await SuperAdminProfile.findOne({
    user: req.user._id,
  });
  if (!superAdminProfile) {
    return res.status(404).send({
      Success: false,
      message: "No super admin profile found for that user!",
    });
  }

  // Get folder destinations
  const uploadFolder = join(__dirname, `../uploads`);
  const superAdminUploadFolder = join(
    __dirname,
    `../uploads/${superAdminProfile.handle}`
  );
  const userFolderName = join(
    __dirname,
    `../uploads/${superAdminProfile.handle}/${folderName}`
  );
  const superAdminFolder = `uploads/${superAdminProfile.handle}/${folderName}`;

  // Check if folders exist
  access(uploadFolder, (error) => {
    if (error) {
      console.log("This folder will be created!");
      mkdir("uploads/", (error) => {
        if (error) console.log("Unable to create parent folder!");
      });
    } else {
      console.log("The uploads folder is present");
    }
  });

  access(superAdminUploadFolder, (error) => {
    if (error) {
      console.log("This user folder will be created!");
      mkdir(`uploads/${superAdminProfile.handle}/`, (error) => {
        if (error) console.log("Unable to create user folder!");
      });
    } else {
      console.log("The sub folder is present!");
    }
  });

  access(userFolderName, (error) => {
    if (error) {
      console.log("This user folder name will be created!");
      mkdir(`${superAdminFolder}`, (error) => {
        if (error) console.log("Unable to create sub folder name!");
        else cb(null, `${superAdminFolder}`);
      });
    } else {
      cb(null, `${superAdminFolder}`);
      console.log(`Uploaded! to the ${superAdminFolder} sub folder`);
    }
  });
};

// Return the found super admin profile
const foundSuperAdminProfile = async (req, res) => {
  try {
    const superAdminProfile = await SuperAdminProfile.findOne({
      user: req.user._id,
    }).select("-password");
    if (!superAdminProfile) {
      return res
        .status(404)
        .send({ Success: false, message: "No super admin Profile found!!!" });
    }

    return { superAdminProfile };
  } catch (error) {
    const errorMessage = `Getting super admin profile error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Return the current profile
const getSuperAdminProfile = async (req, res) => {
  try {
    const superAdminProfile = await SuperAdminProfile.findOne({
      user: req.user._id,
    }).select("-password");
    if (!superAdminProfile) {
      return res
        .status(404)
        .send({ Success: false, message: "No super admin Profile found!!!" });
    }

    res.send({ Success: true, "Super Admin": superAdminProfile });
  } catch (error) {
    const errorMessage = `Getting current super admin profile error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Create your profile
const createSuperAdminProfile = async (req, res) => {
  const inputFields = Object.keys(req.body);
  const { front_end, back_end, bio } = req.body;
  const socials = [
    "youTube",
    "twitter",
    "facebook",
    "linkedIn",
    "codepen",
    "instagram",
  ];

  // Check the validation
  // Return any errors with 400 status
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).send({ Success: false, message: errors });
  }

  // Default fields
  const profileFields = {
    user: req.user._id,
    services: [],
  };

  // Main fields
  inputFields.forEach((field) => {
    if (field) profileFields[field] = req.body[field];
  });

  // Social fields
  profileFields.social = {};
  socials.forEach((social) => {
    if (social) profileFields.social[social] = req.body[social];
  });

  // Skills - We split it into an array, Cause it comes in as a CMV
  profileFields.skills = {};
  const service = {};
  if (typeof front_end !== "undefined")
    profileFields.skills.front_end = front_end.split(",");
  if (typeof back_end !== "undefined")
    profileFields.skills.back_end = back_end.split(",");
  if (typeof bio !== "undefined") profileFields.latest_works["bio"] = bio;

  profileFields.services.push(service);
  // Update the fields if the profile is true
  try {
    const superAdminProfile = await SuperAdminProfile.findOne({
      user: req.user._id,
    });
    if (!superAdminProfile) {
      // Check if the handle exists
      const createProfile = await SuperAdminProfile.findOne({
        handle: profileFields.handle,
      });
      if (createProfile) {
        errors.handle = "That handle already exists";
        return res.status(400).send({ Success: false, message: errors });
      }

      // Save Profile if it doesn't exist
      const savedProfile = await new SuperAdminProfile(profileFields).save();
      if (!savedProfile)
        return res.status(500).send({
          Success: false,
          message: "Unable to save super admin profile!",
        });

      return res.send({ Success: true, "Super Admin": profileFields });
    }

    // Update profile
    const updateProfile = await SuperAdminProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
    if (!updateProfile)
      return res.status(404).send({
        Success: false,
        message: "No user found to create profile for!",
      });

    res.send({ Success: true, "Super Admin": profileFields });
  } catch (error) {
    const errorMessage = `Creating or Updating super admin profile error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Create a new project
const addSuperAdminProject = async (req, res) => {
  const inputFields = Object.keys(req.body);
  const uploadFields = Object.keys(req.file);
  try {
    const { superAdminProfile } = await foundSuperAdminProfile(req, res);
    const newProject = {
      user: req.user._id,
      text: `A new file uploaded by ${
        superAdminProfile.handle
      } on ${new Date()}`,
      cloudinaryPath: "Yet to set the cloudinaryFeature",
    };

    if (!req.file)
      return res.status(415).send({
        Success: false,
        message: "Unsupported file type or upload a file",
      });

    // Text fields
    inputFields.forEach((field) => {
      if (field) newProject[field] = req.body[field];
    });

    if (typeof newProject.used_languages !== "undefined")
      newProject.used_languages = req.body.used_languages.split(",");

    // Upload fields
    uploadFields.forEach((field) => {
      if (field) newProject[field] = req.file[field];
    });

    const fileType = newProject.mimetype.split("/")[0];
    const folderName = fileType.charAt(0).toUpperCase() + fileType.substr(1);
    let cloudinaryResponse;

    // Upload file to cloud
    if (fileType === "image") {
      cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        public_id: `naphtaliduniyaportfoliouploads/${superAdminProfile.handle}/${folderName}/${newProject.filename}`,
        overwrite: true,
        quality: "auto",
        fetch_format: "auto",
      });
    } else {
      return res
        .status(415)
        .send({ Success: false, message: "Please upload a valid file type." });
    }

    if (!cloudinaryResponse)
      return res.status(500).send("Unable to upload file to cloudinary.");

    // Add to file to files array
    newProject.cloudinaryPath = cloudinaryResponse.secure_url;
    superAdminProfile.projects.push(newProject);

    const savedSuperAdminProfile = await superAdminProfile.save();
    if (!savedSuperAdminProfile)
      return res.status(500).send({
        Success: false,
        message: "Unable to save super admin project to db!!!",
      });

    res.send({ Project: newProject });
  } catch (error) {
    const errorMessage = `Creating super admin project error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Updating a super admin project
const updateSuperAdminProject = async (req, res) => {
  const inputFields = Object.keys(req.body);
  const { project_id } = req.params;
  try {
    const { superAdminProfile } = await foundSuperAdminProfile(req, res);

    const projectIndex = superAdminProfile.projects
      .map((project) => project._id)
      .indexOf(project_id);
    if (projectIndex < 0)
      return res.status(404).send({
        Success: false,
        message: "Unable to find project with that ID!!!",
      });

    const foundProject = superAdminProfile.projects[projectIndex];

    if (foundProject.user.toString() !== req.user._id.toString())
      return res.status(403).send({
        Success: false,
        message: "Can not update project you did not create!!!",
      });

    inputFields.forEach((field) => {
      if (field === "path" || field === "cloudinaryPath") return false;
      else if (field) foundProject[field] = req.body[field];
    });

    const saveUpdatedProject = await superAdminProfile.save();
    if (!saveUpdatedProject)
      return res.status(500).send({
        Success: false,
        message: "Unable to save updated project to the database!!!",
      });

    res.send({ Success: true, "Updated Project": foundProject });
  } catch (error) {
    const errorMessage = `Updating super admin project error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

// Delete a super admin project
const deleteSuperAdminProject = async (req, res) => {
  const { project_id } = req.params;
  try {
    const { superAdminProfile } = await foundSuperAdminProfile(req, res);

    const projectIndex = superAdminProfile.projects
      .map((project) => project._id)
      .indexOf(project_id);
    if (projectIndex < 0)
      return res.status(404).send({
        Success: false,
        message: "Unable to find project with that ID!!!",
      });
    const foundProject = superAdminProfile.projects[projectIndex];
    if (foundProject.user.toString() !== req.user._id.toString())
      return res.status(403).send({
        Success: false,
        message: "Can not delete project you did not create!!!",
      });

    const removedProject = superAdminProfile.projects.splice(
      projectIndex,
      1
    )[0];
    const saveUpdatedProject = await superAdminProfile.save();
    if (!saveUpdatedProject)
      return res.status(500).send({
        Success: false,
        message: "Unable to save deleted project to the database!!!",
      });

    res.send({ Success: true, "Deleted Project": removedProject });
  } catch (error) {
    const errorMessage = `Deleting super admin project error ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
};

module.exports = {
  getSuperAdminProfile,
  createSuperAdminProfile,
  addSuperAdminProject,
  updateSuperAdminProject,
  deleteSuperAdminProject,
  diskStorageDestination,
};
