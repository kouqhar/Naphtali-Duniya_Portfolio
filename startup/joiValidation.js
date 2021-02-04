const Joi = require("joi");

// Set up joi validation
module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};
