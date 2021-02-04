const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

// Create Profile Schema
const SuperAdminProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "super_admin",
  },
  handle: {
    type: String,
    required: true,
    max: 40,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    default: "Naphtali",
  },
  about_me: {
    type: String,
  },
  contact_me: {
    type: String,
  },
  developer: {
    type: String,
    default: "Full-Stack",
  },
  phone: {
    type: String,
  },
  homepage_about: {
    type: String,
  },
  company: {
    type: String,
    default: "CEo thymeICQ",
  },
  location: {
    type: String,
  },
  testimonials: [
    {
      edited: {
        type: Boolean,
        default: false,
      },
      defaultId: {
        type: String,
        unique: true,
      },
      user: {
        user: { type: String },
        name: { type: String },
        avatar: { type: String },
        handle: { type: String },
        company: { type: String },
        location: { type: String },
      },
      website: { type: String },
      testimonial_text: {
        type: String,
        min: 10,
        max: 200,
        trim: true,
        unique: true,
        required: true,
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  social: {
    youTube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    instagram: {
      type: String,
    },
    codepen: {
      type: String,
    },
  },
  skills: {
    front_end: {
      type: [String],
    },
    back_end: { type: [String] },
  },
  services: [
    {
      heading: {
        type: String,
      },
      body: {
        type: String,
      },
    },
  ],
  latest_works: {
    bio: {
      type: String,
    },
  },
  home_contact: {
    type: String,
  },
  projects: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "super-admin",
      },
      name: {
        type: String,
      },
      text: {
        type: String,
      },
      url: {
        type: String,
      },
      github_url: {
        type: String,
      },
      used_languages: [String],
      fieldname: {
        type: String,
      },
      originalname: {
        type: String,
      },
      encoding: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      destination: {
        type: String,
      },
      filename: {
        type: String,
      },
      path: {
        type: String,
      },
      size: {
        type: Number,
      },
      cloudinaryPath: {
        type: String,
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      },
      dateUpdated: {
        type: Date,
        default: Date.now,
      },
      dateRemoved: {
        type: Date,
      },
    },
  ],
  history: [
    {
      user: {},
      superAdmin: {},
    },
  ],
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
  dateRemoved: {
    type: Date,
  },
});

// Create Profile Model in the database
const SuperAdminProfile = mongoose.model(
  "super_admin_profile",
  SuperAdminProfileSchema
);

// Validate user input
function validateProfile(user) {
  const schema = Joi.object({
    handle: Joi.string().min(3).max(40).required(),
  });

  return schema.validate(user);
}

module.exports = { SuperAdminProfile, validateProfile };
