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

module.exports = {
  insertInventory,
};
