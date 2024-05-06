import { body } from "express-validator";

export const requireField = (field, messageName) => {
  return body(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${messageName} is required`);
};

export const emailField = (field, messageName) => {
  return body(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${messageName} is required`)
    .isEmail()
    .withMessage(`${messageName} must be a valid email`);
};

export const passwordField = (field, messageName) => {
  return body(field)
    .exists({ checkFalsy: true })
    .withMessage(`${messageName} is required`)
    .isLength({ min: 6 })
    .withMessage(
      `${
        field === "password" ? "Password" : "confirmPassword"
      }${messageName} must be at least 6 characters long.`
    )
    .bail();
};
