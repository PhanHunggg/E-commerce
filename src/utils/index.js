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

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeNullObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });

  return obj;
};

const updateNestedObjParser = (obj) => {
  console.log(`[1]:: `, obj);
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjParser(obj[key]);
      console.log('[3]:: ',response)

      Object.keys(response).forEach((k) => {
        console.log('[4]:: ',response[k])
        final[`${key}.${k}`] = response[k];
      });
    } else {
      final[key] = obj[key];
    }
  });

  console.log(`[2]:: `, final);
  return final;
};

module.exports = {
  getInfoData,
  generateKey,
  getSelectData,
  unGetSelectData,
  removeNullObject,
  updateNestedObjParser,
};
