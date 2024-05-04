const commentModel = require("../comment.model");

const findCommentById = async (commentId) => {
  return await commentModel.findById(commentId);
};

const updateLeftRightCreate = async (productId, rightValue) => {
  await commentModel.updateMany(
    {
      productId,
      right: {
        $gte: rightValue,
      },
    },
    {
      $inc: {
        right: 2,
      },
    }
  );

  await commentModel.updateMany(
    {
      productId,
      left: {
        $gt: rightValue,
      },
    },
    {
      $inc: {
        left: 2,
      },
    }
  );
};

const findComments = async (productId, parentComment, limit, offset) => {
  console.log("parentComment", parentComment);
  if (!parentComment) {
    return await commentModel
      .find({
        productId,
        parentCommentId: parentComment,
      })
      .select({
        left: 1,
        right: 1,
        content: 1,
        parentCommentId: 1,
      })
      .limit(limit)
      .skip(offset)
      .sort({
        left: 1,
      })
      .lean();
  } else {
    return await commentModel
      .find({
        productId,
        left: {
          $gt: parentComment.left,
        },
        right: {
          $lt: parentComment.right,
        },
      })
      .select({
        left: 1,
        right: 1,
        content: 1,
        parentCommentId: 1,
      })
      .limit(limit)
      .skip(offset)
      .sort({
        left: 1,
      })
      .lean();
  }
};

const deleteComments = async (productId, leftValue, rightValue) => {
  await commentModel.deleteMany({
    productId,
    left: {
      $gte: leftValue,
      $lte: rightValue,
    },
  });
};

const updateLeftRightDelete = async (productId, rightValue, width) => {
  await commentModel.updateMany(
    {
      productId,
      right: { $gt: rightValue },
    },
    {
      $inc: {
        right: -width,
      },
    }
  );

  await commentModel.updateMany(
    {
      productId,
      left: { $gt: rightValue },
    },
    {
      $inc: {
        left: -width,
      },
    }
  );
};

module.exports = {
  findCommentById,
  updateLeftRightCreate,
  findComments,
  deleteComments,
  updateLeftRightDelete,
};
