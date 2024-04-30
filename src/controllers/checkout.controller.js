"use strict";

const { SUCCESS, CREATED } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  static checkoutReview = async (req, res, next) => {
    new SUCCESS({
      message: "Checkout review success!",
      metaData: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
  static orderByUser = async (req, res, next) => {
    new CREATED({
      message: "Create order success!",
      metaData: await CheckoutService.orderByUser(req.body),
    }).send(res);
  };
}

module.exports = CheckoutController;
