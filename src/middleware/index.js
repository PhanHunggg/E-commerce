"use strict";

const Logger = require("../loggers/discord.v2.log");

const pushToLogDiscord = (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      title: `Method ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
    return next();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  pushToLogDiscord,
};
