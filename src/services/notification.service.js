"use strict";

const { Notification } = require("../constant");
const notificationModel = require("../models/notification.model");

class NotificationService {
  static async pushNotificationToSystem({
    type = Notification.SHOP_001,
    receivedId = 1,
    senderId = 1,
    options = {},
  }) {
    let content = "";
    switch (type) {
      case Notification.SHOP_001:
        content = `@@@ vừa mới thêm sản phẩm: @@@`;
        break;
      case Notification.PROMOTION_001:
        content = `@@@ vừa mới thêm voucher: @@@`;
        break;
      default:
        break;
    }

    const newNotification = await notificationModel.create({
      type,
      content,
      receivedId,
      senderId,
      options,
    });

    return newNotification;
  }

  static async listNotiByUser({ userId = 1, type = "all", isRead = 0 }) {
    const match = { receivedId: userId };
    if (type !== "all") {
      match["type"] = type;
    }

    return await notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          type: 1,
          senderId: 1,
          receivedId: 1,
          content: 1,
          createAt: 1,
          options: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
