"use strict";
const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { checkProductInCart } = require("./cart.service");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  /**
      {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discounts: [],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ],
            },

            {
                shopId,
                shop_discounts: [
                    {
                        shopId,
                        discountId,
                        codeId
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ],
            }
        ]
      }
     */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart does not exist!");

    const products = shop_order_ids.flatMap((order) => order.item_products);

    await checkProductInCart(products, foundCart);

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, //phi van chuyen
        totalDiscount: 0, // tong giam gia
        totalCheckout: 0, // tong tien phai thanh toan
      },
      shop_order_ids_new = [];

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductService = await checkProductByServer(item_products);
      console.log("checkProductService:: ", checkProductService);

      if (!checkProductService[0]) throw new BadRequestError("Order wrong!!!");

      const checkoutPrice = checkProductService.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia,
        priceApplyDiscount: checkoutPrice, // tien sau khi giam gia
        item_products: checkProductService,
      };

      //neu shop_discounts > 0 thi check xem no co hop le hay khong

      if (shop_discounts.length > 0) {
        for (let shop_discount of shop_discounts) {
          const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
            codeId: shop_discount.codeId,
            userId,
            shopId,
            products: checkProductService,
          });

          // tong discount giam gia
          checkout_order.totalDiscount += discount;
          if (discount > 0) {
            itemCheckout.priceApplyDiscount -= discount;
          }
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
