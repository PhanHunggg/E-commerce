"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const CommentController = require("../../controllers/comment.controller");
const comment = express.Router();

comment.delete("", asyncHandler(CommentController.deleteComment));
comment.post("", asyncHandler(CommentController.createComment));
comment.get("", asyncHandler(CommentController.getCommentByParentId));

module.exports = comment;
