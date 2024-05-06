import express from "express";
import { upload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { requireField } from "../validations/validations.js";
import { authValidator } from "../validations/authValidate.js";
import { authValidation } from "../middleware/auth.js";
import { permit } from "../middleware/accessApi.js";
import productController from "../controllers/productController.js";

const app = express();

app.post(
  "/post-product",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "subImage", maxCount: 5 },
  ]),
  validate([
    authValidator(),
    requireField("title", "title"),
    requireField("status", "status"),
    requireField("price", "price"),
    requireField("selectSize", "selectSize"),
    requireField("description", "description"),
    requireField("color", "color"),
    requireField("material", "material"),
    requireField("userRating", "userRating"),
  ]),
  authValidation,
  permit,
  productController.postProduct
);

app.get(
  "/get-product",
  validate([authValidator()]),
  productController.getProduct
);

app.delete(
  "/delete-product/:id",
  validate([authValidator()]),
  authValidation,
  permit,
  productController.deleteProduct
);

app.put(
  "/update-product/:id",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "subImage", maxCount: 5 },
  ]),
  validate([authValidator()]),
  authValidation,
  permit,
  productController.updateProduct
);

export default app;
