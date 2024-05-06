import jwt from "jsonwebtoken";
import { Admin } from "../models/adminSchema.js";

export const authValidation = async (req, res, next) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecretKey);

    if (decoded.exp <= Date.now() / 1000) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again." });
    }
    const user = await Admin.findById(decoded.adminId);
    if (!user || user.status !== "activate") {
      return res
        .status(403)
        .json({ message: "Admin is not active or does not exist." });
    }
    next();
  } catch (error) {
    next(error);
  }
};
