"use strict";

const { SUCCESS, CREATED } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  static createComment = async (req, res, next) => {
    new CREATED({
      message: "Create comment success!",
      metaData: await CommentService.createComment(req.body),
    }).send(res);
  };

  static getCommentByParentId = async (req, res, next) => {
    new SUCCESS({
      message: "Get comment success!",
      metaData: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  };

  static deleteComment = async (req, res, next) => {
    new SUCCESS({
      message: "Delete comment success!",
      metaData: await CommentService.deleteComment(req.body),
    }).send(res);
  };
}

module.exports = CommentController;
