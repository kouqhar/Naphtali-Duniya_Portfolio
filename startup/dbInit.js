const { connect } = require("mongoose");
const { info: winstonInfo } = require("winston");

// Load config
const { mongoURI } = require("../config/keys");

// Connect application with mongoose
module.exports = function () {
  connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }).then(() => console.log(`${mongoURI} connected Successfully. . .`));
  // Catch and terminate the unconnected process
};
