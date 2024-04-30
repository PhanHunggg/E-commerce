"use strict";

const cartModel = require("../cart.model");

const findCartById = async (id) => {
  return await cartModel.findOne({ _id: id, state: "active" }).lean();
};

const updateCartToOrder = async (cartId, products) => {
  return await cartModel.updateOne(
    {
      _id: cartId,
    },
    {
      $set: {
        products,
      },
    }
  );
};

module.exports = { findCartById, updateCartToOrder };
