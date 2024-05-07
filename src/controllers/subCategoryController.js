import BaseError from "../errorHandler/HttpError.js";
import statusCode from "../errorHandler/statusCode.js";
import { SubCategory } from "../models/subCategorySchema.js";
import { deleteFile, processImage } from "../utils/Fileops.js";

const postSubCategory = async (req, res, next) => {
  try {
    const { categoryId, title, status } = req.body;
    const subCategoryImage = req.file;
    if (!subCategoryImage) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Sub category image is required"
      );
    }
    const existingTitle = await SubCategory.findOne({ title });
    if (existingTitle) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Title already exists",
        true
      );
    }
    const dirctoryName = "subCategory";
    const subCategoryImagePath = await processImage(
      dirctoryName,
      subCategoryImage
    );
    const newSubCategory = new SubCategory({
      Category: categoryId,
      title: title,
      image: subCategoryImagePath,
      status: status,
    });
    await newSubCategory.save();

    res.status(statusCode.CREATED).json({
      message: "Sub category created successfully",
      data: newSubCategory,
      statusCode: statusCode.CREATED,
    });
  } catch (err) {
    next(err);
  }
};

const getSubCategory = async (req, res, next) => {
  try {
    const { categoryId, limit = 1, page = 1 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const skip = (options.page - 1) * options.limit;

    if (categoryId) {
      const allsubCategory = await SubCategory.find({
        Category: categoryId,
      })
        .skip(skip)
        .limit(options.limit);
      res.status(200).json({
        message: "Subcategories fetched successfully",
        data: allsubCategory,
        limit: limit,
        page: options.page,
      });
    } else {
      const allsubCategory = await SubCategory.find();
      res.status(200).json({
        message: "Subcategories fetched successfully",
        data: allsubCategory,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      throw new BaseError(
        "NOT_FOUND",
        statusCode.NOT_FOUND,
        "subCategory does not exist",
        true
      );
    }
    await SubCategory.findByIdAndDelete(id);
    await deleteFile(subCategory.image);
    res.status(statusCode.SUCCESS).json({
      message: "subCategory and image deleted successfully",
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const subCategoryImage = req.file;

    let subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: "SubCategory does not exist" });
    }

    if (subCategoryImage) {
      if (subCategory.image) {
        await deleteFile(subCategory.image);
      }
      subCategory.image = await processImage(subCategoryImage);
    }

    subCategory.title = title || subCategory.title;
    subCategory.status = status || subCategory.status;

    await subCategory.save();

    res.status(statusCode.SUCCESS).json({
      message: "subCategory updated successfully",
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  postSubCategory,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
};
