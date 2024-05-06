import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  Category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

export const SubCategory = mongoose.model("subCategory", subCategorySchema);
