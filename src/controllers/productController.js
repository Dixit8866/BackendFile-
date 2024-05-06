import path from "path";
import BaseError from "../errorHandler/HttpError.js";
import statusCode from "../errorHandler/statusCode.js";
import { Product } from "../models/productSchema.js";
import { deleteFile, processImage } from "../utils/Fileops.js";
import fs from "fs";
import { uploadDirectory } from "../middleware/multer.js";

const postProduct = async (req, res, next) => {
  try {
    const {
      categoryId,
      subcategoryId,
      title,
      status,
      price,
      selectSize,
      description,
      color,
      material,
      userRating,
      productCategory,
    } = req.body;
    const productImages = req.files;

    if (!productImages || !productImages.subImage) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Image is required"
      );
    }

    const existingTitle = await Product.findOne({ title });
    if (existingTitle) {
      throw new BaseError(
        "BAD_REQUEST",
        statusCode.BAD_REQUEST,
        "Title already exists",
        true
      );
    }

    const directoryName = "Product";
    const fileName = directoryName + "/" + title;

    const productMainImagePath = await processImage(
      fileName,
      productImages.thumbnailImage[0]
    );

    // google Logic
    const productImagePath = await Promise.all(
      productImages.subImage.map(async (image) => {
        return await processImage(fileName, image);
      })
    );

    const newProduct = new Product({
      category: categoryId,
      subcategory: subcategoryId,
      title,
      status,
      price,
      selectSize,
      description,
      color,
      material,
      userRating,
      thumbnailImage: productMainImagePath,
      subImages: productImagePath,
      productCategory,
    });

    await newProduct.save();

    res.status(statusCode.CREATED).json({
      message: "Product created successfully",
      data: newProduct,
      statusCode: statusCode.CREATED,
    });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(statusCode.SUCCESS).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new BaseError(
        "NOT_FOUND",
        statusCode.NOT_FOUND,
        "deletedProduct does not exist",
        true
      );
    }
    res.status(statusCode.SUCCESS).json({
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      subcategoryId,
      title,
      status,
      price,
      selectSize,
      description,
      color,
      material,
      userRating,
      productCategory,
    } = req.body;
    const productImages = req.files;
    let product = await Product.findById(id);
    if (!product) {
      throw new BaseError(
        "NOT_FOUND",
        statusCode.NOT_FOUND,
        "Product does not exist",
        true
      );
    }
    if (productImages) {
      if (product.thumbnailImage) {
        await deleteFile(product.thumbnailImage);
      }
      if (product.subImages) {
        await Promise.all(
          product.subImages.map(async (image) => {
            await deleteFile(image);
          })
        );
      }
      const directoryName = "Product";
      const fileName = directoryName + "/" + title;

      if (title !== product.title) {
        const oldDirectoryPath = path.join(uploadDirectory, product.title);
        await deleteFile(oldDirectoryPath);
      }

      const productMainImagePath = await processImage(
        fileName,
        productImages.thumbnailImage[0]
      );
      // google Logic
      const productImagePath = await Promise.all(
        productImages.subImage.map(async (image) => {
          return await processImage(fileName, image);
        })
      );
      product = await Product.findByIdAndUpdate(id, {
        category: categoryId,
        subcategory: subcategoryId,
        title,
        status,
        price,
        selectSize,
        description,
        color,
        material,
        userRating,
        thumbnailImage: productMainImagePath,
        subImages: productImagePath,
        productCategory,
      });
      res.status(statusCode.SUCCESS).json({
        message: "Product updated successfully",
        data: product,
      });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  postProduct,
  getProduct,
  deleteProduct,
  updateProduct,
};
