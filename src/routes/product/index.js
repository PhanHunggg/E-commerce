"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const { permission } = require("../../auth/checkAuth");
const product = express.Router();

product.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

product.get("", asyncHandler(productController.getAllProducts));

product.get("/:id", asyncHandler(productController.findProduct));

//authentication
product.use(authentication);

product.post("", asyncHandler(productController.createNewProduct));

product.patch("/:productId", asyncHandler(productController.updateProduct ));

//PUT
product.put(
  "/published/:id",
  asyncHandler(productController.publishProductByShop)
);
product.put(
  "/unpublished/:id",
  asyncHandler(productController.unPublishProductByShop)
);

//QUERY
product.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
product.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = product;
