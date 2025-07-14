import {Router} from 'express';
import {getProducts,
    addProduct,
    updateProduct, 
    deactivateProduct, 
    searchProduct, 
    assignProductToUser,
    removeProductFromUser,
    getUserProducts
    } from "./product.controller.js"

import {addProductValidator, 
    updateProductValidator, 
    deactivateProductValidator, 
    searchProductValidator, 
    assignProductToUserValidator,
    removeProductFromUserValidator,
    getUserProductsValidator} from "../middlewares/product-validator.js";

import { uploadProductImage, handleUploadErrors } from '../middlewares/cloudinary-uploads.js';

const router = Router()

/**
 * @swagger
 * /product/:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente
 *       404:
 *         description: No se encontraron productos
 */
router.get("/", getProducts);

/**
 * @swagger
 * /product/agregar:
 *   post:
 *     summary: Agregar un nuevo producto
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto agregado correctamente
 *       500:
 *         description: Error al agregar el producto
 */
router.post("/agregar", uploadProductImage, addProductValidator, handleUploadErrors ,addProduct);

/**
 * @swagger
 * /product/actualizar/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.put("/actualizar/:id", uploadProductImage, updateProductValidator, handleUploadErrors ,updateProduct);

/**
 * @swagger
 * /product/desactivar/{id}:
 *   patch:
 *     summary: Activar o desactivar un producto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto activado/desactivado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.patch("/desactivar/:id", deactivateProductValidator ,deactivateProduct);

/**
 * @swagger
 * /product/buscar/{name}:
 *   get:
 *     summary: Buscar productos por nombre
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del producto
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       404:
 *         description: No se encontraron productos con ese nombre
 */
router.get("/buscar/:name", searchProductValidator ,searchProduct);

/**
 * @swagger
 * /product/asignar:
 *   post:
 *     summary: Asignar un producto a un usuario
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto asignado al usuario correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/asignar", assignProductToUserValidator ,assignProductToUser);

/**
 * @swagger
 * /product/eliminar:
 *   delete:
 *     summary: Eliminar un producto de un usuario
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del usuario correctamente
 *       400:
 *         description: Error de validación
 */
router.delete("/eliminar", removeProductFromUserValidator ,removeProductFromUser);

/**
 * @swagger
 * /product/usuario/{userId}:
 *   get:
 *     summary: Obtener productos de un usuario
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Productos del usuario obtenidos correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/usuario/:userId", getUserProductsValidator, getUserProducts);

export default router;
