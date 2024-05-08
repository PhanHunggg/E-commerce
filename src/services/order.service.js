"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const {
  findAllOrderByUser,
  findOneOrderUser,
  cancelOrderByUser,
} = require("../models/repositories/order.repo");
const { deleteProductsInCart } = require("./cart.service");
const CheckoutService = require("./checkout.service");
const { updateDiscountUsed } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class OrderService {
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check lai 1 lan nua xem vuot ton kho hay khong
    //get new arr productId
    const products = shop_order_ids_new.flatMap((order) => order.item_products);

    //get new arr discount
    const discounts = shop_order_ids_new.flatMap(
      (order) => order.shop_discounts
    );
    console.log("[1]: ", products);

    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      console.log(keyLock);
      acquireProduct.push(keyLock ? true : false);
      console.log(acquireProduct);
      if (keyLock) {
        await releaseLock(keyLock);
        console.log("Success del key");
      }
    }

    // //check lai neu co 1 san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng!"
      );
    }

    const newOrder = await orderModel.create({
      user: userId,
      checkout: checkout_order,
      shipping: user_address,
      payment: user_payment,
      products: shop_order_ids_new,
    });

    // neu insert thanh cong thi remove san pham trong gio hang
    if (newOrder) {
      // update Discount used
      await updateDiscountUsed(discounts, userId);
      //remove product cart
      await deleteProductsInCart(cartId, products);
    }

    return newOrder;
  }

  static async getOrdersByUser({ limit, userId, page }) {
    const orders = await findAllOrderByUser({
      limit: +limit,
      page: +page,
      filter: {
        user: +userId,
      },
      unSelect: ["__v", "trackingNumber"],
    });

    return orders;
  }

  static async getOneOrderByUser({ userId, orderId }) {
    const order = await findOneOrderUser({
      filter: {
        user: +userId,
        _id: orderId,
      },
      unSelect: ["__v", "trackingNumber"],
    });

    return order;
  }

  static async cancelOrdersByUser({ userId, orderId }) {
    const order = await findOneOrderUser({
      filter: {
        user: userId,
        _id: orderId,
      },
      unSelect: ["__v", "trackingNumber"],
    });
    console.log(order);

    if (!order) throw new NotFoundError("Order does not exists!");
    console.log(order.status);
    if (order.status !== "pending")
      throw new BadRequestError("Orders cannot be canceled!");
    const cancelOrder = await cancelOrderByUser({ userId, orderId });

    return cancelOrder.modifiedCount > 0 ? "cancelled" : cancelOrder.status;
  }

  static updateOrderStatusByShop() {}
}

module.exports = OrderService;
