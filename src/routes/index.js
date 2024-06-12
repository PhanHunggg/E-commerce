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
const comment = require("./comment");
const order = require("./order");
const notification = require("./notification");

// add log to discord
router.use(pushToLogDiscord);
//check apiKey
router.use(apiKey);
//check permissions
router.use(permission("0000"));

router.use("/v1/api/notification", notification);
router.use("/v1/api/comment", comment);
router.use("/v1/api/inventory", inventory);
router.use("/v1/api/checkout", checkout);
router.use("/v1/api/order", order);
router.use("/v1/api/discount", discount);
router.use("/v1/api/cart", cart);
router.use("/v1/api/product", product);
router.use("/v1/api", access);

module.exports = router;
