"use strict";

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "Chung cu Him Lam Nam Khanh, p5, q8, HCM",
  }) {
    const product = await getProductById(productId);

    if (!product) throw new BadRequestError("The product does not exists!");

    const query = {
        shopId,
        productId,
      },
      updateSet = {
        $inc: {
          stock,
        },
        $set: {
          location,
        },
      },
      option = {
        upsert: true,
        new: true,
      };

    return await inventoryModel.findOneAndUpdate(query, updateSet, option);
  }
}

module.exports = InventoryService;
