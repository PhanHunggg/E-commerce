"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = redis.createClient();

redisClient.ping((err, result) => {
  if (err) {
    console.error("Error connecting to Redis:", err);
  } else {
    console.log("Connected to Redis");
  }
});

redisClient.on("error", function (err) {
  console.error("Error connecting to Redis:", err);
});

const pExpire = promisify(redisClient.pexpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  console.log(productId);
  const key = `lock_v2024_${productId}`;
  console.log(key);
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    console.log(`Attempt ${i + 1} to acquire lock`);
    try {
      const result = await setNXAsync(key, expireTime);
      console.log(result);
      if (result === 1) {
        console.log("Lock acquired, attempting reservation");
        const isReservation = await reservationInventory({
          productId,
          quantity,
          cartId,
        });

        if (isReservation.modifiedCount) {
          await pExpire(key, expireTime);
          return key;
        }
        return null;
      } else {
        console.log("Failed to acquire lock, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (error) {
      throw error;
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);

  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
