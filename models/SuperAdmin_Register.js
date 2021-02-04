const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { secretOrSuperAdminKey } = require("../config/keys");

// Creating Registration Schema
const SuperAdminSchema = new mongoose.Schema({
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
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

SuperAdminSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      isSuperAdmin: this.isSuperAdmin,
      name: this.name,
    },
    secretOrSuperAdminKey
  );
  // , { algorithm : RS512, expiresIn: 60 * 60 }
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Create Admin Model in the database
const SuperAdmin = mongoose.model("super_admin", SuperAdminSchema);

// Validate admin input
function validateSuperAdmin(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(user);
}

// Validate login input
function validateSuperAdminLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
}

// Validate resetting password input
function validateSuperAdminResetPassword(req) {
  const schema = Joi.object({
    new_password: Joi.string().min(8).max(255).required(),
    confirm_password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = {
  SuperAdmin,
  validateSuperAdmin,
  validateSuperAdminLogin,
  validateSuperAdminResetPassword,
};
