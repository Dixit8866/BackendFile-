import express from "express";
import bannerController from "../controllers/bannerController.js";
import { upload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { requireField } from "../validations/validations.js";
import { authValidator } from "../validations/authValidate.js";
import { authValidation } from "../middleware/auth.js";
import { permit } from "../middleware/accessApi.js";

const app = express();

app.post(
  "/post-banner",
  upload.single("image"),
  validate([
    authValidator(),
    requireField("title", "title"),
    requireField("status", "status"),
  ]),
  authValidation,
  permit,
  bannerController.postBanner
);

app.get("/get-banner", validate([authValidator()]), bannerController.getBanner);

app.delete(
  "/delete-banner/:id",
  validate([authValidator()]),
  authValidation,
  permit,
  bannerController.deleteBanner
);

app.put(
  "/update-banner/:id",
  upload.single("image"),
  validate([authValidator()]),
  authValidation,
  permit,
  bannerController.updateBanner
);

export default app;
