"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const OrderController = require("../../controllers/order.controller");
const order = express.Router();

// checkout.use(authentication);

order.post("", asyncHandler(OrderController.orderByUser));
order.get("", asyncHandler(OrderController.getOrdersByUser));
order.get("/get-one", asyncHandler(OrderController.getOneOrderByUser));
order.patch("", asyncHandler(OrderController.cancelOrdersByUser));

module.exports = order;
