const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

// Create Profile Schema
const UserProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  handle: {
    type: String,
    required: true,
    max: 40,
    trim: true,
    unique: true,
  },
  company: {
    type: String,
    default: "Entrepreneur",
  },
  location: {
    type: String,
    required: true,
  },
  testimonial: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      edited: {
        type: Boolean,
        default: false,
      },
      defaultId: {
        type: String,
        unique: true,
      },
      website: {
        type: String,
      },
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
      dateUpdated: [
        {
          date: { type: Date, default: Date.now },
          update: { type: String },
        },
      ],
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
});

// Create Profile Model in the database
const UserProfile = mongoose.model("user_profile", UserProfileSchema);

// Validate user input
function validateProfile(user) {
  const schema = Joi.object({
    handle: Joi.string().min(3).max(40).required(),
  });

  return schema.validate(user);
}
// Validate testimonial text
function validateTestimonialText(user) {
  const schema = Joi.object({
    testimonial_text: Joi.string().min(10).max(200).required(),
  });

  return schema.validate(user);
}

module.exports = { UserProfile, validateProfile, validateTestimonialText };
