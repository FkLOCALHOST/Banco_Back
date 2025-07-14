import {body, param} from 'express-validator';
import {validationsFields} from './fields-validator.js';
import {catchErrors} from './catch-errors.js';
import {validateJWT} from './validate-token.js';
import {hasRoles} from './validate-role.js';
import {productExist} from '../helpers/db-validators.js';


export const addProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .custom(productExist),
    body('description')
        .notEmpty()
        .withMessage('Product description is required'),
    body('price')
        .notEmpty()
        .withMessage('Product price is required')
        .isNumeric()
        .withMessage('Product price must be a number'),
    body('category')
        .notEmpty()
        .withMessage('Product category is required')
        .isIn(['SEGUROS', 'TARJETA', 'PLANES', 'PRESTAMOS', 'PROMOCION'])
        .withMessage('Invalid product category'),
    body('stock')
        .notEmpty()
        .withMessage('Product stock is required')
        .isNumeric()
        .withMessage('Product stock must be a number'),
    validationsFields,
    catchErrors
]

export const updateProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Product name is required'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Product description is required'),
    body('price')
        .optional()
        .notEmpty()
        .withMessage('Product price is required')
        .isNumeric()
        .withMessage('Product price must be a number'),
    body('category')
        .optional()
        .notEmpty()
        .withMessage('Product category is required')
        .isIn(['Electrodomesticos', 'Ropa', 'Juguetes', 'Tecnologia', 'Hogar'])
        .withMessage('Invalid product category'),
    body('stock')
        .optional()
        .notEmpty()
        .withMessage('Product stock is required')
        .isNumeric()
        .withMessage('Product stock must be a number'),
    validationsFields,
    catchErrors
]

export const deactivateProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    validationsFields,
    catchErrors
]

export const searchProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('name')
        .notEmpty()
        .withMessage('Product name is required'),
    validationsFields,
    catchErrors
]

export const assignProductToUserValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    validationsFields,
    catchErrors
]

export const removeProductFromUserValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    validationsFields,
    catchErrors
]

export const getUserProductsValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid MongoDB ID'),
    validationsFields,
    catchErrors
]

