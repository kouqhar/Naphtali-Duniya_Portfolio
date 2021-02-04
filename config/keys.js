// Test the working environment
if (process.env.NODE_ENV === "production") {
  module.exports = require("./Keys_prod");
} else {
  module.exports = require("./Keys_dev");
}
