"use strict";

const ProductService = require("../services/product.service");
const {
  CREATED,
  SUCCESS,
  SuccessResponse,
} = require("../core/success.response");

class ProductController {
  createNewProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new Product success",
      metaData: await ProductService.createProduct(req.body.type, {
        ...req.body,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product success",
      metaData: await ProductService.updateProduct(
        req.body.type,
        req.params.productId,
        {
          ...req.body,
          shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product published successfully",
      metaData: await ProductService.publishProductByShop({
        shop: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublished product success!",
      metaData: await ProductService.unPublishProductByShop({
        shop: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @desc get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON} next
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Drafts success",
      metaData: await ProductService.findAllDraftsForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Published success",
      metaData: await ProductService.findAllPublishForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Published success",
      metaData: await ProductService.searchProduct(req.params),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list getAllProducts success",
      metaData: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Find product success",
      metaData: await ProductService.findProduct({
        id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
