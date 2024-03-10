"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const access = express.Router();

//sign up

access.post("/shop/signup", asyncHandler(accessController.signUp));
//login
access.post("/shop/login", asyncHandler(accessController.login));

//authentication
access.use(authentication);
///////////////////////////

access.post("/shop/logout", asyncHandler(accessController.logout));
access.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = access;
