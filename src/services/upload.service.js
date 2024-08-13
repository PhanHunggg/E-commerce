"use strict";
const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const randomImageName = () => crypto.randomBytes(16).toString("hex");

class UploadService {
  static uploadImgFromLocalS3 = async (file) => {
    try {
      const imageName = randomImageName();
      
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: "image/jpeg",
      });

      const result = await s3.send(command);

      const getCommand = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
      });

      const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

      return url;
    } catch (error) {
      throw error;
    }
  };

  static uploadImgFromCloud = async () => {
    try {
      const urlImage =
        "https://www.timeoutdubai.com/cloud/timeoutdubai/2021/09/11/hfpqyV7B-IMG-Dubai-UAE-1200x800.jpg";
      const folderName = "product/shopId",
        newFileName = "testDemo";

      const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  static uploadImgFromLocal = async ({
    path,
    shopId,
    name,
    folder = "product/",
  }) => {
    const folderName = `${folder}${shopId}`;

    const result = await cloudinary.uploader.upload(path, {
      public_id: name,
      folder: folderName,
    });

    console.log(shopId, name);
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  };
}

module.exports = UploadService;
