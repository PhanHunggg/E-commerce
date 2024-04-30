"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const cart = express.Router();

cart.post("", asyncHandler(cartController.addProductToCart));
cart.put("", asyncHandler(cartController.deleteProduct));
cart.patch("/update", asyncHandler(cartController.updateProductToCart));
cart.get("", asyncHandler(cartController.getListUserCart));

module.exports = cart;
