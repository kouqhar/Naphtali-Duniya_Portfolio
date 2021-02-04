const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config/keys");

// Creating Registration Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isUserVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    secretOrKey
  );
  // , { algorithm : RS512, expiresIn: 60 * 60 }
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Create User Model in the database
const User = mongoose.model("user", UserSchema);

// Validate user input
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(user);
}

// Validate login input
function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
}

// Validate resetting password input
function validateResetPassword(req) {
  const schema = Joi.object({
    new_password: Joi.string().min(8).max(255).required(),
    confirm_password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = { User, validateUser, validateLogin, validateResetPassword };
