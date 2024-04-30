"use strict";

const { SUCCESS } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  static addStockToInventory = async (req, res, next) => {
    new SUCCESS({
      message: "Add stock to inventory success!",
      metaData: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = InventoryController;
