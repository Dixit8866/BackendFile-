import { Admin } from "../models/adminSchema.js";
import bcrypt from "bcrypt";
import statusCode from "../errorHandler/statusCode.js";
import jwt from "jsonwebtoken";
import BaseError from "../errorHandler/HttpError.js";

const userSignUp = async (req, res, next) => {
  try {
    const { adminName, email, password, confirmPassword, role, status } =
      req.body;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (hashedPassword) {
      if (password !== confirmPassword) {
        throw new BaseError(
          "PasswordMismatchError",
          statusCode.BAD_REQUEST,
          "Password do not match",
          true
        );
      }
    }
    const existingUser = await Admin.findOne({ adminName });
    if (existingUser) {
      throw new BaseError(
        "NOT FOUND",
        statusCode.BAD_REQUEST,
        "Admin already Exists",
        true
      );
    }
    const admin = new Admin({
      adminName,
      email,
      password: hashedPassword,
      role,
      status,
    });
    const savedAdmin = await admin.save();
    const token = jwt.sign(
      { adminId: savedAdmin._id, adminName: adminName, role: role },
      jwtSecretKey,
      {
        expiresIn: "1d",
      }
    );
    res.status(statusCode.CREATED).json({
      message: "User Created Successfully",
      data: savedAdmin,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      throw new BaseError(
        "NOT FOUND",
        statusCode.BAD_REQUEST,
        "Email Not Found",
        true
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw new BaseError(
        "UNAUTHORIZED",
        statusCode.UNAUTHORIZED,

        "Wrong Incridential",
        true
      );
    }
    const token = jwt.sign({ adminId: existingUser._id }, jwtSecretKey, {
      expiresIn: "1d",
    });
    res.status(statusCode.CREATED).json({
      message: "User Successfully Login",
      data: existingUser,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export default { userSignUp, userLogin };
