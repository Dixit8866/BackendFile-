import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
});

export const Category = mongoose.model("category", categorySchema);
