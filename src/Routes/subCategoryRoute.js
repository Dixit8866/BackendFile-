import express from "express";
import { upload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { requireField } from "../validations/validations.js";
import { authValidator } from "../validations/authValidate.js";
import { authValidation } from "../middleware/auth.js";
import { permit } from "../middleware/accessApi.js";
import subCategoryController from "../controllers/subCategoryController.js";

const app = express();

app.post(
  "/post-subcategory",
  upload.single("image"),
  validate([
    authValidator(),
    requireField("title", "title"),
    requireField("status", "status"),
  ]),
  authValidation,
  permit,
  subCategoryController.postSubCategory
);

app.get(
  "/get-subcategory",
  validate([authValidator()]),
  subCategoryController.getSubCategory
);

app.delete(
  "/delete-subcategory/:id",
  validate([authValidator()]),
  authValidation,
  permit,
  subCategoryController.deleteSubCategory
);

app.put(
  "/update-subcategory/:id",
  upload.single("image"),
  validate([authValidator()]),
  authValidation,
  permit,
  subCategoryController.updateSubCategory
);

export default app;
