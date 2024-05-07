import BaseError from "../errorHandler/HttpError.js";
import statusCode from "../errorHandler/statusCode.js";
import { Category } from "../models/categorySchema.js";
import { deleteFile, processImage } from "../utils/Fileops.js";

const postCategory = async (req, res, next) => {
  try {
    const { title, status } = req.body;
    const categoryImage = req.file;
    if (!categoryImage) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Category image is required",
        true
      );
    }
    const existingTitle = await Category.findOne({ title });
    if (existingTitle) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Title already exists",
        true
      );
    }
    const dirctoryName = "Category";
    const fileName = await processImage(dirctoryName, categoryImage);
    const category = new Category({ title, status, image: fileName });
    const savedCategory = await category.save();
    res.status(statusCode.CREATED).json({
      message: "Banner uploaded successfully",
      data: savedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { title, limit = 1, page = 1 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const skip = (options.page - 1) * options.limit;

    if (title) {
      const categories = await Category.find({
        title: title,
      });
      res
        .status(statusCode.SUCCESS)
        .json({
          message: "Categories fetched successfully",
          data: categories,
        })
        .skip(skip)
        .limit(options.limit);
    } else {
      const categories = await Category.find();
      res.status(statusCode.SUCCESS).json({
        message: "Categories fetched successfully",
        data: categories,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      throw new BaseError(
        "NOT_FOUND",
        statusCode.NOT_FOUND,
        "Category does not exist",
        true
      );
    }
    await Category.findByIdAndDelete(id);
    await deleteFile(category.image);
    res.status(statusCode.SUCCESS).json({
      message: "Category and image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const categoryImage = req.file;

    let category = await Category.findById(id);
    if (!category) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: "Category does not exist" });
    }

    if (categoryImage) {
      if (category.image) {
        await deleteFile(category.image);
      }
      category.image = await processImage(categoryImage);
    }

    category.title = title || category.title;
    category.status = status || category.status;

    await category.save();

    res.status(statusCode.SUCCESS).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export default { postCategory, getCategory, deleteCategory, updateCategory };
