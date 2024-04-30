"use strict";

const { CREATED, SUCCESS } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  static addProductToCart = async (req, res, next) => {
    new CREATED({
      message: "Product added to cart successfully!",
      metaData: await CartService.addProductToCart(req.body),
    }).send(res);
  };
  static updateProductToCart = async (req, res, next) => {
    new SUCCESS({
      message: "Product added to cart successfully!",
      metaData: await CartService.updateProductToCart(req.body),
    }).send(res);
  };
  static deleteProduct = async (req, res, next) => {
    new SUCCESS({
      message: "Delete cart successfully!",
      metaData: await CartService.deleteProduct(req.body),
    }).send(res);
  };
  static getListUserCart = async (req, res, next) => {
    new SUCCESS({
      message: "Get list product cart successfully!",
      metaData: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = CartController;
