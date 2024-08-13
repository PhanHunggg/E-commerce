// upload/index.js
"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helper/authentication");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config"); // Correct path to multer.config.js

const upload = express.Router();

// POST /img endpoint
upload.post(
  "/img",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImgFromLocalS3)
);

// POST /test endpoint using multer disk storage
upload.post("/test", asyncHandler(uploadController.uploadImgFromUrl));

upload.post(
  "/local",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadImgFromLocal)
);

module.exports = upload;
