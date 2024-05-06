import express from "express";
import UserController from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import {
  requireField,
  emailField,
  passwordField,
} from "../validations/validations.js";

const app = express();

app.post(
  "/signupUser",
  validate([
    requireField("adminName", "Admin name"),
    requireField("role", "Role"),
    requireField("status", "Status"),
    emailField("email", "Email"),
    passwordField("password", "Password", "confirmPassword"),
    requireField("confirmPassword", "ConfirmPassword"),
  ]),
  UserController.userSignUp
);

app.post(
  "/loginUser",
  validate([
    emailField("email", "Email"),
    passwordField("password", "Password"),
  ]),
  UserController.userLogin
);

export default app;
