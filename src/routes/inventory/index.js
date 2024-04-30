"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const InventoryController = require("../../controllers/inventory.controller");
const inventory = express.Router();

inventory.use(authentication);

inventory.post(
  "/add-stock",
  asyncHandler(InventoryController.addStockToInventory)
);

module.exports = inventory;
