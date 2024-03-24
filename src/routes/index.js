"use strict";

const express = require("express");
const router = express.Router();
const access = require("./access");
const product = require("./product");
const discount = require("./discount");
const { apiKey, permission } = require("../auth/checkAuth");

//check apiKey
router.use(apiKey);
//check permissions
router.use(permission("0000"));

router.use("/v1/api/discount", discount);
router.use("/v1/api/product", product);
router.use("/v1/api", access);

module.exports = router;
