import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "subAdmin"],
  },
  status: {
    type: String,
    required: true,
    enum: ["activate", "deactivate", "delete"],
  },
});

export const Admin = mongoose.model("admin", adminSchema);
