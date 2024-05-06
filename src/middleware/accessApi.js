import jwt from "jsonwebtoken";
import statusCode from "../errorHandler/statusCode.js";
import { Admin } from "../models/adminSchema.js";

export const permit = async (req, res, next) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecretKey);
    const user = await Admin.findById(decoded.adminId);
    if (user.role === "admin") {
      next();
    } else {
      throw new Error(
        "You are not authorized to perform this action",
        statusCode.UNAUTHORIZED
      );
    }
  } catch (error) {
    next(error);
  }
};

