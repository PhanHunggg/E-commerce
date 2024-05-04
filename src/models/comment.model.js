"user strict";
const mongoose = require("mongoose");
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
var commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: Number,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DOCUMENT_NAME
    },
    isDelete: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
