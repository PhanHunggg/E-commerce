"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesUnselect,
  checkDiscountExists,
  updateUsedDiscount,
  updateUserUsedQuantity,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjIdMongo } = require("../utils");

class DiscountService {
  static createDiscount = async (body) => {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      type,
      users_used,
      max_uses_per_user,
      uses_count,
      desc,
      value,
      name,
      max_uses,
      max_value,
    } = body;

    // ktra date

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Date code has expired");
    // }

    const foundDiscount = await checkDiscountExists({
      code,
      shop_id: shopId,
    });

    if (foundDiscount && foundDiscount.is_active) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = await discountModel.create({
      code,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      is_active,
      shop_id: shopId,
      min_order_value: min_order_value || 0,
      product_ids: applies_to === "all" ? [] : product_ids,
      applies_to,
      type,
      users_used,
      max_uses_per_user,
      uses_count,
      desc,
      value,
      name,
      max_uses,
      max_value,
    });

    return newDiscount;
  };

  static updateDiscount = async (discountId, bodyUpdate) => {
    const foundDiscount = await checkDiscountExists({
      _id: discountId,
    });
    if (!foundDiscount) {
      throw new BadRequestError("Discount does not exist");
    }

    const objParams = removeNullObject(bodyUpdate);
    const updateDiscount = await discountModel.findByIdAndUpdate(
      discountId,
      objParams
    );
    return updateDiscount;
  };

  // get all discount codes available with product
  static getAllDiscountCodesWithProduct = async ({
    code,
    shopId,
    userId,
    limit,
    page,
  }) => {
    const foundDiscount = await checkDiscountExists({
      code,
      shop_id: shopId,
    });

    if (!foundDiscount || !foundDiscount.is_active) {
      throw new NotFoundError("Discount does not exist");
    }

    const { applies_to, product_ids } = foundDiscount;

    let products = [];

    if (applies_to === "all") {
      products = await findAllProducts({
        filter: {
          shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["name"],
      });
    } else {
      products = await findAllProducts({
        filter: {
          _id: { $in: product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["name"],
      });
    }

    return products;
  };

  static getAllDiscountCodesByShop = async ({ limit, page, shopId }) => {
    const discounts = findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        shop_id: shopId,
        is_active: true,
      },
      unSelect: ["__v", "shop_id"],
    });

    return discounts;
  };

  // function giam gia tien san pham
  static getDiscountAmount = async ({ codeId, userId, shopId, products }) => {
    const foundDiscount = await checkDiscountExists({
      code: codeId,
      shop_id: shopId,
    });

    if (!foundDiscount) throw new NotFoundError("Discount does not exist");

    const {
      is_active,
      max_uses,
      min_order_value,
      max_uses_per_user,
      users_used,
      type,
      value,
      applies_to,
      product_ids,
      start_date,
      end_date,
      max_value,
    } = foundDiscount;

    if (!is_active) throw new BadRequestError("Discount is not active");
    if (!max_uses) throw new BadRequestError("Discount has ended");

    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Date code has expired");
    // }

    // checkProduct specific
    if (applies_to === "specific") {
      let checkProduct = [];
      for (let product of products) {
        const pro = product_ids.find(
          (productId) => productId === product.productId
        );
        checkProduct.push(pro ? true : false);
      }

      if (checkProduct.includes(false))
        throw new BadRequestError("Sản phẩm không được áp dụng voucher!");
    }

    // check xem co set gia tri toi thieu khong
    let totalOrder = 0;
    if (min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (totalOrder < min_order_value)
        throw new BadRequestError(
          `Discount requires a minium order value of ${min_order_value}`
        );
    }

    // check xem user đã dùng voucher chưa
    if (max_uses_per_user > 0) {
      const userUsedDiscount = users_used.find(
        (user) => user.userId === userId
      );
      if (userUsedDiscount && userUsedDiscount.count === max_uses_per_user) {
        throw new BadRequestError(`Discount has been used`);
      }
    }

    //check type discount
    let amount = 0;
    if (type === "fixed_amount") {
      amount = value;
    } else {
      if (max_value > 0) {
        const total = totalOrder * (value / 100);
        if (total >= max_value) {
          amount = max_value;
        } else {
          amount = total;
        }
      } else {
        amount = totalOrder * (value / 100);
      }
    }

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  };

  static deleteDiscount = async ({ shopId, codeId }) => {
    const deleted = await discountModel.findOneAndDelete({
      code: codeId,
      shop_id: convertToObjIdMongo(shopId),
    });

    return deleted;
  };

  /**
   * Cancel Discount
   */
  static cancelDiscountCode = async ({ code, shopId, userId }) => {
    const foundDiscount = await checkDiscountExists({
      code,
      shop_id: convertToObjIdMongo(shopId),
    });

    if (!foundDiscount) throw new NotFoundError("Discount does not exist");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        users_used: userId,
      },
      $inc: {
        max_uses: 1,
        uses_count: -1,
      },
    });
    return result;
  };

  static async updateDiscountUsed(discounts, userId) {
    for (let discount of discounts) {
      const foundDiscount = await checkDiscountExists({
        _id: discount.discountId,
      });

      const checkUserUsed = foundDiscount.users_used.find(
        (user) => user.userId === userId
      );

      if (!checkUserUsed) {
        await updateUsedDiscount({
          discountId: foundDiscount._id,
          user: {
            userId,
            count: 1,
          },
        });
      } else {
        await updateUserUsedQuantity({
          discountId: foundDiscount._id,
          userId,
        });
      }
    }
  }
}

module.exports = DiscountService;
