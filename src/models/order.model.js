"user strict";
const mongoose = require("mongoose");
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
    },
    checkout: {
      type: Object,
      default: {},
    },
    shipping: {
      type: Object,
      default: {},
    },
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      required: true,
    },
    trackingNumber: {
      type: String,
      default: "#0000129042024",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
