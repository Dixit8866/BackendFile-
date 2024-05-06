import { header } from "express-validator";

export const authValidator = () => {
  return header("authorization")
    .exists({ checkFalsy: true })
    .withMessage("Authorization header is required")
    .bail()
    .custom((value) => {
      if (!value.startsWith("Bearer")) {
        throw new Error("Authorization type must be Bearer");
      }
      return true;
    });
};
