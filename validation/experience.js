const validator = require("validator");
const isEmpty = require("./customValidation/is-empty");

// Validate the user input on creating an experience
function validateExperienceInput({ company }) {
  let errors = {};

  company = !isEmpty(company) ? company : "";

  if (validator.isEmpty(company)) {
    errors.company = "Company field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = validateExperienceInput;
