const { isLength, isEmpty: validatorIsEmpty, isURL } = require("validator");
const isEmpty = require("./customValidation/is-empty");

// Validate the user input on creating a profile
function validateProfileInput({
  handle,
  website,
  youTube,
  twitter,
  facebook,
  linkedIn,
  codepen,
  instagram,
}) {
  let errors = {};

  handle = !isEmpty(handle) ? handle : "";

  if (!isLength(handle, { min: 3, max: 40 })) {
    errors.handle = "Handle needs to be between 3 and 40 characters";
  }

  if (validatorIsEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }

  if (!isEmpty(website)) {
    if (!isURL(website)) {
      errors.website = "This is not a valid URL";
    }
  }

  if (!isEmpty(youTube)) {
    if (!isURL(youTube)) {
      errors.youTube = "This is not a valid URL";
    }
  }

  if (!isEmpty(twitter)) {
    if (!isURL(twitter)) {
      errors.twitter = "This is not a valid URL";
    }
  }

  if (!isEmpty(facebook)) {
    if (!isURL(facebook)) {
      errors.facebook = "This is not a valid URL";
    }
  }

  if (!isEmpty(linkedIn)) {
    if (!isURL(linkedIn)) {
      errors.linkedIn = "This is not a valid URL";
    }
  }

  if (!isEmpty(instagram)) {
    if (!isURL(instagram)) {
      errors.instagram = "This is not a valid URL";
    }
  }

  if (!isEmpty(codepen)) {
    if (!isURL(codepen)) {
      errors.codepen = "This is not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateProfileInput };
