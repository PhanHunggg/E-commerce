"use strict";

const AccessService = require("../services/access.service");
const {
  CREATED,
  SUCCESS,
  SuccessResponse,
} = require("../core/success.response");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "GetToken Success",
      metaData: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  logout = async (req, res, next) => {
    console.log(123);
    new SuccessResponse({
      message: "Logout Success",
      metaData: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metaData: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register Ok!",
      metaData: await AccessService.signUp(req.body),
      option: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
