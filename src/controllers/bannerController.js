import { query } from "express";
import BaseError from "../errorHandler/HttpError.js";
import statusCode from "../errorHandler/statusCode.js";
import { Banner } from "../models/bannerSchema.js";
import { deleteFile, processImage } from "../utils/Fileops.js";

const postBanner = async (req, res, next) => {
  try {
    const { title, status } = req.body;
    const bannerImage = req.file;
    if (!bannerImage) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Banner image is required",
        true
      );
    }
    const existingTitle = await Banner.findOne({ title });
    if (existingTitle) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Title already exists",
        true
      );
    }
    const dirctoryName = "Banner";
    const fileName = await processImage(dirctoryName, bannerImage);
    const banner = new Banner({ title, status, image: fileName });
    const savedBanner = await banner.save();
    res.status(statusCode.CREATED).json({
      message: "Banner uploaded successfully",
      data: savedBanner,
    });
  } catch (error) {
    next(error);
  }
};

const getBanner = async (req, res, next) => {
  try {
    const { title, limit = 1, page = 1 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const skip = (options.page - 1) * options.limit;

    if (title) {
      const banners = await Banner.find({ title: title });
      res
        .status(statusCode.SUCCESS)
        .json({
          message: "Banners fetched successfully",
          data: banners,
        })
        .skip(skip)
        .limit(options.limit);
    } else {
      const banners = await Banner.find();
      res.status(statusCode.SUCCESS).json({
        message: "Banners fetched successfully",
        data: banners,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    console.log(banner, "banner");
    if (!banner) {
      throw new BaseError(
        "NOT_FOUND",
        statusCode.NOT_FOUND,
        "Banner does not exist",
        true
      );
    }
    await Banner.findByIdAndDelete(id);
    await deleteFile(banner.image);
    res.status(statusCode.SUCCESS).json({
      message: "Banner and image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const bannerImage = req.file;

    let banner = await Banner.findById(id);
    if (!banner) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: "Banner does not exist" });
    }

    if (bannerImage) {
      if (banner.image) {
        await deleteFile(banner.image);
      }
      banner.image = await processImage(bannerImage);
      // console.log(banner.image, "banner.image");
    }

    banner.title = title || banner.title;
    banner.status = status || banner.status;

    await banner.save();

    res.status(statusCode.SUCCESS).json({
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

export default { postBanner, getBanner, deleteBanner, updateBanner };
