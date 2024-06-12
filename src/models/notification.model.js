"user strict";
const mongoose = require("mongoose");
const { Notification } = require("../constant");
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";
// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new PROMOTION khuyến mãi
// SHOP-001: new product by user follow

var notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        Notification.ORDER_001,
        Notification.ORDER_002,
        Notification.PROMOTION_001,
        Notification.SHOP_001,
      ],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    receivedId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
