"use strict";
const { unGetSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExists = async (filter) => {
  return await discountModel.findOne(filter).lean();
};

const updateUsedDiscount = async ({ discountId, user }) => {
  return await discountModel.findOneAndUpdate(
    {
      _id: discountId,
    },
    {
      $addToSet: {
        users_used: user,
      },
      $inc: {
        max_uses: -1,
        uses_count: 1,
      },
    }
  );
};

const updateUserUsedQuantity = async ({ discountId, userId }) => {
  return await discountModel.findOneAndUpdate(
    {
      _id: discountId,
      "users_used.userId": userId,
    },
    {
      $inc: {
        max_uses: -1,
        uses_count: 1,
        "users_used.$.count": 1,
      },
    }
  );
};

module.exports = {
  updateUserUsedQuantity,
  updateUsedDiscount,
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
