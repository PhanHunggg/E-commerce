"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const product = express.Router();

//authentication
product.use(authentication);
///////////////////////////

product.post("", asyncHandler(productController.createNewProduct));

module.exports = product;
