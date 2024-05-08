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
}

module.exports = CheckoutController;
