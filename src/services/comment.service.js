"use strict";

const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const {
  findCommentById,
  updateLeftRightCreate,
  findComments,
  deleteComments,
  updateLeftRightDelete,
} = require("../models/repositories/comment.repo");
const { getProductById } = require("../models/repositories/product.repo");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError("Product not found");

    let rightValue = 0;

    if (parentCommentId) {
      const parentComment = await findCommentById(parentCommentId);

      if (!parentComment) throw new NotFoundError("Comment not found!");

      rightValue = parentComment.right;

      await updateLeftRightCreate(productId, rightValue);
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          productId,
        },
        "right",
        { sort: { right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }

    const newComment = await commentModel.create({
      productId,
      userId,
      content,
      left: rightValue,
      right: rightValue + 1,
      parentCommentId,
    });

    return newComment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parentComment = await findCommentById(parentCommentId);

      if (!parentComment) throw new NotFoundError("Comment not found!");

      const comments = await findComments(
        productId,
        parentComment,
        limit,
        offset
      );

      return comments;
    } else {
      const comments = await findComments(
        productId,
        parentCommentId,
        limit,
        offset
      );

      return comments;
    }
  }

  static async deleteComment({ commentId, productId }) {
    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError("Product not found");

    const foundComment = await findCommentById(commentId);

    if (!foundComment) throw new NotFoundError("Comment not found");

    const leftValue = foundComment.left;
    const rightValue = foundComment.right;

    const width = rightValue - leftValue + 1;
    // xoas
    await deleteComments(productId, leftValue, rightValue);

    // cap nhat left right

    await updateLeftRightDelete(productId, rightValue, width);

    return true;
  }
}

module.exports = CommentService;
