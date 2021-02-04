// Load Utils
const { secretOrKey } = require("../config/keys");

module.exports = function () {
  // Setting the environmental variable
  if (!secretOrKey) {
    throw new Error(`FATAL ERROR: Setup Secrete Key is not defined.`);
  }
};
