"use strict";
const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData, generateKey } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { RoleShop } = require("../constant");
const { findByEmail } = require("./shop.service");
const { Types } = require("mongoose"); // Make sure to import ObjectId

class AccessService {
  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { email, userId } = user;

    const foundRefreshToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    if (foundRefreshToken) {
      await KeyTokenService.deleteById(userId);

      throw new ForbiddenError("Something weird happened!! Please relogin");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Invalid refresh token");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    //create token moi

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await KeyTokenService.updateByIdRefreshToken(
      keyStore._id,
      tokens.refreshToken,
      refreshToken
    );
    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    console.log(keyStore);
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new BadRequestError("Shop not registered!");

    const match = await bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError("Authentication error!");
    const { privateKey, publicKey } = generateKey();

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      metaData: {
        shop: getInfoData({
          filed: ["_id", "name", "email"],
          obj: foundShop,
        }),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new ConflictRequestError("Error: Shop already registered!");
    }

    const passHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      email,
      name,
      password: passHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      //create privateKey, publicKey
      // cachs 1 cac cong ty lon hay sai
      // const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      // cach 2
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      //public key cryptoGraphy Standards

      // console.log({ publicKey, privateKey }); // save collection key store

      const publicKeyString = await KeyTokenService.createToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        return {
          code: "xxx",
          message: "publicKeyString error",
        };
      }

      // const publicKeyObj = crypto.createPublicKey(publicKeyString);

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      if (!tokens) {
        return {
          code: 400,
          message: "token error",
        };
      }

      return {
        metaData: {
          shop: getInfoData({
            filed: ["_id", "name", "email"],
            obj: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metaData: null,
    };
  };
}

module.exports = AccessService;
