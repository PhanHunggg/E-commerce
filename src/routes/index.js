"use strict";

const express = require("express");
const router = express.Router();
const access = require("./access");
const product = require("./product");
const { apiKey, permission } = require("../auth/checkAuth");

//check apiKey
router.use(apiKey);
//check permissions
router.use(permission("0000"));

router.use("/v1/api", access);
router.use("/v1/api/product", product);

module.exports = router;


