import {body, param} from 'express-validator';
import { validationsFields } from "./fields-validator.js";
import { catchErrors } from "./catch-errors.js";
import { validateJWT } from "./validate-token.js";
import { hasRoles } from "./validate-role.js";
import { serviceExist} from '../helpers/db-validators.js';


export const addServiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name")
        .notEmpty()
        .withMessage("Service name is required")
        .custom(serviceExist),
    body("description")
        .notEmpty()
        .withMessage("Service description is required"),
    validationsFields,
    catchErrors
]

export const updateServiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB ID"),
    body("name")
        .optional()
        .notEmpty()
        .withMessage("Service name is required"),
    body("description")
        .optional()
        .notEmpty()
        .withMessage("Service description is required"),
    body("price")
        .optional()
        .notEmpty()
        .withMessage("Service price is required")
        .isNumeric()
        .withMessage("Service price must be a number"),
    validationsFields,
    catchErrors
]

export const deactivateServiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB ID"),
    validationsFields,
    catchErrors
]

export const searchServiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("name")
        .notEmpty()
        .withMessage("Service name is required"),
    validationsFields,
    catchErrors
]
    
export const assignServiceToUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("userId")
        .isMongoId()
        .withMessage("Invalid MongoDB ID for user"),
    body("serviceId")
        .isMongoId()
        .withMessage("Invalid MongoDB ID for service"),
    validationsFields,
    catchErrors
]

export const removeServiceFromUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("userId")
        .isMongoId()
        .withMessage("Invalid MongoDB ID for user"),
    body("serviceId")
        .isMongoId()
        .withMessage("Invalid MongoDB ID for service"),
    validationsFields,
    catchErrors
]

export const getUserServicesValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("userId")
        .isMongoId()
        .withMessage("Invalid MongoDB ID for user"),
    validationsFields,
    catchErrors
]