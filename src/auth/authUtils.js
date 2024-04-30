"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helper/authentication");
const { HEADER } = require("../constant");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2d",
    });

    // refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7d",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Err verify: ", err);
      } else {
        console.log("Decode verify: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1- check userId missing??
   * 2- get accessToken
   * 3- VerifyToken
   * 4- Check user in dbs
   * 5- check keyStore with this userId?
   * 6- Oke all => return next()
   */

  //1
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid request");
  //2
  const keyStore = await findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not found keyStore");

  //3

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = verifyJWT(refreshToken, keyStore.privateKey, userId);

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = verifyJWT(accessToken, keyStore.publicKey, userId);

    req.keyStore = keyStore;
    req.user = decodeUser;

    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = (token, keySecret, userId) => {
  const decodeUser = JWT.verify(token, keySecret);

  if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid User");
  return decodeUser;
};

module.exports = { createTokenPair, authentication, verifyJWT };
