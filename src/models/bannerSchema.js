import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
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

export const Banner = mongoose.model("banner", bannerSchema);
