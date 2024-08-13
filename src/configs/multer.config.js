// multer.config.js
"use strict";

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const uploadDisk = multer({ storage: storage });

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

module.exports = { uploadDisk, uploadMemory };
