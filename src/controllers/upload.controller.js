const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");

const UploadService = require("../services/upload.service");

class UploadController {
  uploadImgFromLocalS3 = async (req, res, next) => {
    const { file } = req;

    if (!file) throw new BadRequestError("No file uploaded");

    new SuccessResponse({
      message: "Upload image successfully!",
      metaData: await UploadService.uploadImgFromLocalS3(file),
    }).send(res);
  };

  uploadImgFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload image successfully!",
      metaData: await UploadService.uploadImgFromCloud(),
    }).send(res);
  };

  uploadImgFromLocal = async (req, res, next) => {
    const { file} = req;

    if (!file) throw new BadRequestError("No file uploaded");

    new SuccessResponse({
      message: "Upload image successfully!",
      metaData: await UploadService.uploadImgFromLocal({
        path: file.path,
        shopId: req.body.shopId,
        name: req.body.name,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
