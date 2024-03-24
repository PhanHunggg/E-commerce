"use strict"; // giảm rò rỉ bộ nhớ trong nodejs
const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "fixed_amount", // percentage: giam theo phan tram hoac gia tien
    },
    value: {
      type: Number,
      required: true, // 10.000, 10%
    },
    max_value: {
      type: Number,
      required: true, // 10.000, 10%
    },
    code: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    max_uses: {
      // so luong discount dc ap dung
      type: Number,
      required: true,
    },
    uses_count: {
      // so discount da su dung
      type: Number,
      required: true,
    },
    users_used: {
      // những used đã dùng discount
      type: Array,
      default: [],
    },
    max_uses_per_user: {
      // so luong cho phep toi da duowc su dung
      type: Number,
      required: true,
    },
    min_order_value: {
      //gia tri toi thieu su dung
      type: Number,
      required: true,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    is_active: {
      //trang thai voucher
      type: Boolean,
      default: true,
    },
    applies_to: {
      //app dung duoc tat ca san pham hay khong
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    product_ids: {
      // so san pham dc ap dung
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
