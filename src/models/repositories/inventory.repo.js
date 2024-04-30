const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModel.create({
    productId,
    shopId,
    stock,
    location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      productId,
      stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        stock: -quantity,
      },
      $push: {
        reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    };

  return await inventoryModel.updateOne(query, updateSet);
};
module.exports = {
  insertInventory,
  reservationInventory
};
