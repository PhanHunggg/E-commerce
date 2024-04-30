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
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeNullObject, updateNestedObjParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

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

  static async updateProduct(type, productId, payload) {
    const productClass = this.productRegister[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
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
      select: ["name", "price", "thumb", "shop"],
    });
  }

  static async findProduct({ id }) {
    return await findProduct({ id, unSelect: ["__v"] });
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

  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      await insertInventory({
        productId,
        shopId: this.shop,
        stock: this.quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
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

  async updateProduct(productId) {
    /** Lọc giá trị
     * 1 remove attributes has  null undefined
     * 2 check xem update o cho nao
     */

    const objParams = removeNullObject(this);
    if (objParams.attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjParser(objParams.attributes),
        model: clothing,
      });
    }
    //update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjParser(objParams)
    );
    return updateProduct;
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

  async updateProduct(productId) {
    /** Lọc giá trị
     * 1 remove attributes has  null undefined
     * 2 check xem update o cho nao
     */

    const objParams = removeNullObject(this);
    if (objParams.attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjParser(objParams.attributes),
        model: electronics,
      });
    }
    //update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjParser(objParams)
    );
    return updateProduct;
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

  async updateProduct(productId) {
    /** Lọc giá trị
     * 1 remove attributes has  null undefined
     * 2 check xem update o cho nao
     */

    const objParams = removeNullObject(this);
    if (objParams.attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjParser(objParams.attributes),
        model: furniture,
      });
    }
    //update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjParser(objParams)
    );
    return updateProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
