"use strict";

// !mdbgum

const { Schema, model } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

var shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      // shop này được hoạt động hay không
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      //xác minh shop đã đc đký thành công
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      // shop này được phép làm gì trong hệ thống
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
module.exports = model(DOCUMENT_NAME, shopSchema);
