import { body, param } from "express-validator";
import { uidExist } from "../helpers/db-validators.js";
import { catchErrors } from "./catch-errors.js";
import { validationsFields } from "./fields-validator.js";
import { validateTransactionDayLimit } from "../helpers/transaction-limitator.js";

export const createTransactionValidator = [
    body("receiver").notEmpty().withMessage("El campo receptor es obligatorio"),
    body("sender").isMongoId().withMessage("No es un id Válido"),
    body("sender").custom(uidExist),
    body("amount").isFloat({min: 1, max: 2000}).withMessage("El monto debe estar entre el rango de 1 a 2000"),
    catchErrors,
    validationsFields
]

export const revertTransactionValidator = [
    param("uid").isMongoId().withMessage("El ID de la transaccion no es válido")
]