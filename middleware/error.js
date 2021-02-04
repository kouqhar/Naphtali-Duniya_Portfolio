const { error: winstonError } = require("winston");

module.exports = function (error, req, res, next) {
  // Log the exception
  winstonError(error.message, error);

  console.log(error);

  // Send an internal error message to the user
  return res
    .status(500)
    .send(`Error middleware error message from ${req.originalUrl}. ${error}`);
};
