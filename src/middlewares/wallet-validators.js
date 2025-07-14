import { body, param } from "express-validator";
import { validationsFields } from "./fields-validator.js";
import { catchErrors } from "./catch-errors.js";
import { validateJWT } from "./validate-token.js";
import { uidExist } from "../helpers/db-validators.js";

export const getWalltValidator = [
  validateJWT,
  validationsFields,
  uidExist,
  catchErrors,
];
