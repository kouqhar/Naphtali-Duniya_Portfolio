const { isLength, isEmpty: valIsEmpty } = require("validator");
const isEmpty = require("./customValidation/is-empty");

// Validate the user input on creating a post
function validatePostInput({ text }) {
  let errors = {};

  text = !isEmpty(text) ? text : "";

  // Limit the text characters
  if (!isLength(text, { min: 1, max: 200 })) {
    errors.text = "Post must be between 1 and 200 characters";
  }

  // Post field should not be empty
  if (valIsEmpty(text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = validatePostInput;
