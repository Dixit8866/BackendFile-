import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  subImages: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  selectSize: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  color: [
    {
      type: String,
    },
  ],
  material: {
    type: String,
    required: true,
  },
  userRating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
});

export const Product = mongoose.model("product", productSchema);
