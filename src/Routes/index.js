import express from "express";
import userRoute from "./userRoute.js";
import bannerRoute from "./bannerRoute.js";
import categoryRoute from "./categoryRoute.js";
import subCategoryRoute from "./subCategoryRoute.js";
import productRoute from "./productRoute.js";

const app = express();

app.use("/v1/admin/auth", userRoute);
app.use("/v1/admin/banner", bannerRoute);
app.use("/v1/admin/category", categoryRoute);
app.use("/v1/admin/subcategory", subCategoryRoute);
app.use("/v1/admin/product", productRoute);

export default app;
