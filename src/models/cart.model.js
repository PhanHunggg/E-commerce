"user strict";
const mongoose = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Cart";
var cartSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    count_product: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
