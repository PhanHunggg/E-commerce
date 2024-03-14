" use strict";

const {
  product,
  clothing,
  electronics,
  furniture,
} = require("../models/products.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
} = require("../models/repositories/product.repo");

class ProductFactory {
  /**
   * type : 'Clothing',
   * payload
   */

  static productRegister = {}; // key-class

  static registerProductType(type, classRef) {
    this.productRegister[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegister[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, payload) {
    const productClass = this.productRegister[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  //PUT//
  static async publishProductByShop({ shop, productId }) {
    return await publishProductByShop({ shop, productId });
  }

  static async unPublishProductByShop({ shop, productId }) {
    return await unPublishProductByShop({ shop, productId });
  }
  //END PUT //

  //QUERY
  static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isDraff: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['name', 'price', 'thumb']
    });
  }

  static async findProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
}

class Product {
  constructor({
    name,
    thumb,
    description,
    price,
    quantity,
    type,
    shop,
    attributes,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// Define sub-class for different product Clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.attributes,
      shop: this.shop,
    });

    if (!newClothing) throw new BadRequestError("Create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);

    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.attributes,
      shop: this.shop,
    });

    if (!newElectronic)
      throw new BadRequestError("Create new Electronics error");

    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.attributes,
      shop: this.shop,
    });

    if (!newFurniture)
      throw new BadRequestError("Create new Electronics error");

    const newProduct = await super.createProduct(newFurniture._id);

    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
