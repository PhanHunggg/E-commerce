"use strict";

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
  /**
   * add product
   * reduce product
   * increase product
   * get cart
   * delete cart
   * delete cart item
   */

  static async createUserCart({ userId, product }) {
    const query = { user_id: userId, state: "active" },
      updateOrInsert = {
        $addToSet: { products: product },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product, userCart }) {
    const { product_id, quantity } = product;
    const options = { upsert: true, new: true };

    const productIndex = userCart.products.findIndex(
      (p) => p.product_id === product_id
    );

    if (productIndex === -1) {
      // Product not found in the cart, add it
      const query = { user_id: userId, state: "active" },
        updateSet = {
          $addToSet: { products: product },
        };
      return await cartModel.findOneAndUpdate(query, updateSet, options);
    } else {
      const query = {
          user_id: userId,
          "products.product_id": product_id,
          state: "active",
        },
        updateSet = {
          $inc: {
            "products.$.quantity": quantity,
          },
        };
      return await cartModel.findOneAndUpdate(query, updateSet, options);
    }
  }

  static async addProductToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ user_id: userId });

    const foundProduct = await getProductById(product.product_id);

    if (!foundProduct) throw new NotFoundError("Product not found");

    product = {
      ...product,
      name: foundProduct.name,
      price: foundProduct.price,
    };

    if (!userCart) {
      return await this.createUserCart({ userId, product });
    }

    // neu co gio hang roi nhung chua co san pham
    if (!userCart.products.length) {
      userCart.products = [product];
      return userCart.save();
    }

    // gio hang tontai va co san pham thi update quantity
    return await this.updateUserCartQuantity({ userId, product, userCart });
  }

  static deleteProduct = async ({ userId, productId }) => {
    const query = { user_id: userId, state: "active" },
      updateSet = {
        $pull: {
          products: {
            product_id: productId,
          },
        },
      };

    const deleteCart = await cartModel.updateOne(query, updateSet);

    return deleteCart;
  };

  static async updateProductToCart({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_product[0];

    const userCart = await cartModel.findOne({ user_id: userId });

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    // compare
    if (foundProduct.shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product do not belong to the shop");

    if (quantity === 0) {
      return await this.deleteProduct({ userId, productId: foundProduct._id });
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        product_id: productId,
        quantity: quantity - old_quantity,
      },
      userCart,
    });
  }

  static getListUserCart = async ({ userId }) => {
    return await cartModel.findOne({ user_id: userId }).lean();
  };
}

module.exports = CartService;
