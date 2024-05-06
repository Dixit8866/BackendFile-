import { validationResult } from "express-validator";
import HTTP from "../errorHandler/statusCode.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = errors.array()[0];
        return res.status(HTTP.UNPROCESSABLE_ENTITY).json({
          title: error.param,
          message: error.msg,
          code: HTTP.UNPROCESSABLE_ENTITY,
          status: false,
        });
      }
    }
    return next();
  };
};
