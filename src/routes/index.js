"use strict";

const express = require("express");
const router = express.Router();
const access = require("./access");
const product = require("./product");
const discount = require("./discount");
const cart = require("./cart");
const { apiKey, permission } = require("../auth/checkAuth");
const checkout = require("./checkout");
const inventory = require("./inventory");
const { pushToLogDiscord } = require("../middleware");

// add log to discord
router.use(pushToLogDiscord);
//check apiKey
router.use(apiKey);
//check permissions
router.use(permission("0000"));

router.use("/v1/api/inventory", inventory);
router.use("/v1/api/checkout", checkout);
router.use("/v1/api/discount", discount);
router.use("/v1/api/cart", cart);
router.use("/v1/api/product", product);
router.use("/v1/api", access);

module.exports = router;
