"use strict";

const keyTokenModel = require("../models/keyToken.model");

const { Types } = require("mongoose");

class KeyTokenService {
  static createToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // publicKey sinh ra từ thuật toán bất đối xứng nên có kiểu là buffer nên ta chuyển thành kiểu string để lưu không lỗi
      // const publicKeyString = publicKey.toString();
      // lv0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // });

      // lv xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static deleteById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };

  static updateByIdRefreshToken = async (
    id,
    refreshToken,
    refreshTokenUsed
  ) => {
    return await keyTokenModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          refreshToken: refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshTokenUsed,
        },
      }
    );
  };
}

module.exports = KeyTokenService;
