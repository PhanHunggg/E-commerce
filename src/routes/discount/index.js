"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const discount = express.Router();

// get amount discount
discount.get("/amount", asyncHandler(discountController.getDiscountAmount));

discount.get(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

discount.use(authentication);

discount.post("", asyncHandler(discountController.createDiscountCode));

discount.get("", asyncHandler(discountController.getAllDiscountCodesByShop));

module.exports = discount;
