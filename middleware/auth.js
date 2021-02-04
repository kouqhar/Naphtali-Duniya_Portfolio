const jwt = require("jsonwebtoken");
const { isJWT } = require("validator");
const { info: winstonInfo } = require("winston");

// Load Utils and Model
const { secretOrKey, secretOrSuperAdminKey } = require("../config/keys");
const { User } = require("../models/User_Register");
const { SuperAdmin } = require("../models/SuperAdmin_Register");

// Authenticate user credentials for access
async function auth(req, res, next) {
  // Verify that it is a valid token if token is true
  // Here we need to use our jwt
  let token = req.header("Authorization");
  if (!token || token === "" || token === "null")
    return res
      .status(401)
      .send({ Success: false, message: "Access denied. No token provided." });

  token = req.header("Authorization").replace("Bearer ", "");
  const isValidJwt = isJWT(token);
  if (!isValidJwt)
    return res.status(401).send("Auth invalid json web token!!!");

  try {
    const decoded = jwt.verify(token, secretOrKey);
    // , { algorithm : ['RS512'] }
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user)
      return res.status(401).send({
        Success: false,
        message: "You need to login or verify email.",
      });

    req.token = token;
    req.user = user;

    // Pass control to the next middleware function in the req processing pipeline
    next();
  } catch (error) {
    const errorMessage = `Unable to authenticate this user : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
}

// Authenticate Admin credentials for access
async function authAdmin(req, res, next) {
  // Verify that it is a valid token if token is true
  // Here we need to use our jwt
  let token = req.header("Authorization");
  if (!token || token === "" || token === "null")
    return res
      .status(401)
      .send({ Success: false, message: "Access denied. No token provided." });

  token = req.header("Authorization").replace("Bearer ", "");
  const isValidJwt = isJWT(token);
  if (!isValidJwt)
    return res.status(401).send("Admin Auth invalid json web token!!!");

  try {
    const decoded = jwt.verify(token, secretOrKey);
    // , { algorithm : ['RS512'] }
    const user = await User.findOne({
      _id: decoded._id,
      isAdmin: decoded.isAdmin,
      "tokens.token": token,
    });

    if (!user)
      return res.status(401).send({
        Success: false,
        message: "You need to login.",
      });

    req.token = token;
    req.user = user;

    // Pass control to the next middleware function in the req processing pipeline
    next();
  } catch (error) {
    const errorMessage = `Unable to authenticate this admin : ${user}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
}

// Authenticate Super-Admin credentials for access
async function authSuperAdmin(req, res, next) {
  // Verify that it is a valid token if token is true
  // Here we need to use our jwt
  let token = req.header("Authorization");
  if (!token || token === "" || token === "null")
    return res
      .status(401)
      .send({ Success: false, message: "Access denied. No token provided." });

  token = req.header("Authorization").replace("Bearer ", "");
  const isValidJwt = isJWT(token);
  if (!isValidJwt)
    return res.status(401).send("Super Admin Auth invalid json web token!!!");

  try {
    const decoded = jwt.verify(token, secretOrSuperAdminKey);
    // , { algorithm : ['RS512'] }
    const superAdmin = await SuperAdmin.findOne({
      _id: decoded._id,
      isAdmin: true,
      isSuperAdmin: true,
      "tokens.token": token,
    });

    if (!superAdmin)
      return res.status(401).send({
        Success: false,
        message: "You need to login.",
      });

    req.token = token;
    req.user = superAdmin;

    // Pass control to the next middleware function in the req processing pipeline
    next();
  } catch (error) {
    const errorMessage = `Unable to authenticate this super-admin : ${error}`;
    winstonInfo(errorMessage);
    res.status(500).send(errorMessage);
  }
}

module.exports = { auth, authAdmin, authSuperAdmin };
