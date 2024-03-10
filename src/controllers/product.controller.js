"use strict";

const ProductService = require("../services/product.service");
const {
  CREATED,
  SUCCESS,
  SuccessResponse,
} = require("../core/success.response");

class ProductController {
  createNewProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success",
      metaData: await ProductService.createProduct(req.body.type, {
        ...req.body,
        shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
