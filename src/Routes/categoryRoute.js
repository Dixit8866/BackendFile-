import express from "express";
import { upload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { requireField } from "../validations/validations.js";
import { authValidator } from "../validations/authValidate.js";
import { authValidation } from "../middleware/auth.js";
import { permit } from "../middleware/accessApi.js";
import categoryController from "../controllers/categoryController.js";

const app = express();

app.post(
  "/post-category",
  upload.single("image"),
  validate([
    authValidator(),
    requireField("title", "title"),
    requireField("status", "status"),
  ]),
  authValidation,
  permit,
  categoryController.postCategory
);

app.get(
  "/get-category",
  validate([authValidator()]),
  categoryController.getCategory
);

app.delete(
  "/delete-category/:id",
  validate([authValidator()]),
  authValidation,
  permit,
  categoryController.deleteCategory
);

app.put(
  "/update-category/:id",
  upload.single("image"),
  validate([authValidator()]),
  authValidation,
  permit,
  categoryController.updateCategory
);

export default app;
