const { isEmpty: valIsEmpty } = require("validator");
const isEmpty = require("./customValidation/is-empty");

// Validate the user input on creating an education
function validateEducationInput({ school, degree, fieldOfStudy, from }) {
  let errors = {};

  school = !isEmpty(school) ? school : "";
  degree = !isEmpty(degree) ? degree : "";
  fieldOfStudy = !isEmpty(fieldOfStudy) ? fieldOfStudy : "";
  from = !isEmpty(from) ? from : "";

  if (valIsEmpty(school)) {
    errors.school = "School field is required";
  }

  if (valIsEmpty(degree)) {
    errors.degree = "Degree field is required";
  }

  if (valIsEmpty(fieldOfStudy)) {
    errors.fieldOfStudy = "Field Of Study field is required";
  }

  if (valIsEmpty(from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = validateEducationInput;
