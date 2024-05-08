"use strict";

const { SUCCESS, CREATED } = require("../core/success.response");
const OrderService = require("../services/order.service");

class OrderController {
  static orderByUser = async (req, res, next) => {
    new CREATED({
      message: "Create order success!",
      metaData: await OrderService.orderByUser(req.body),
    }).send(res);
  };

  static getOrdersByUser = async (req, res, next) => {
    new SUCCESS({
      message: "Get order success!",
      metaData: await OrderService.getOrdersByUser(req.query),
    }).send(res);
  };

  static getOneOrderByUser = async (req, res, next) => {
    new SUCCESS({
      message: "Get order success!",
      metaData: await OrderService.getOneOrderByUser(req.query),
    }).send(res);
  };

  static cancelOrdersByUser = async (req, res, next) => {
    new SUCCESS({
      message: "Cancel order success!",
      metaData: await OrderService.cancelOrdersByUser(req.body),
    }).send(res);
  };
}

module.exports = OrderController;
