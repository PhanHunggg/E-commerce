"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const CheckoutController = require("../../controllers/checkout.controller");
const checkout = express.Router();

// checkout.use(authentication);

checkout.post("/review", asyncHandler(CheckoutController.checkoutReview));

module.exports = checkout;
