"use strict";

const crypto = require("node:crypto");
const _ = require("lodash");

const getInfoData = ({ filed = [], obj = {} }) => {
  return _.pick(obj, filed);
};


const generateKey = () => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");
  return {
    privateKey,
    publicKey,
  };
};

module.exports = { getInfoData, generateKey };
