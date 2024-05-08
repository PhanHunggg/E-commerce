const { unGetSelectData } = require("../../utils");
const orderModel = require("../order.model");

const findAllOrderByUser = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await orderModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
};
const findOneOrderUser = async ({ filter, unSelect }) => {
  return await orderModel
    .findOne(filter)
    .select(unGetSelectData(unSelect))
    .lean();
};

const cancelOrderByUser = async ({userId, orderId}) => {
return await orderModel.updateOne(
    {
        user: userId,
        _id: orderId
    },
    {
        $set: {
            status: "cancelled"
        }
    }
)
}

module.exports = {
  findAllOrderByUser,
  findOneOrderUser,
  cancelOrderByUser
};
