"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/authentication");
const { authentication } = require("../../auth/authUtils");
const NotificationController = require("../../controllers/notification.controller");
const notification = express.Router();

notification.use(authentication);

notification.get("", asyncHandler(NotificationController.listNotiByUser));

module.exports = notification;
