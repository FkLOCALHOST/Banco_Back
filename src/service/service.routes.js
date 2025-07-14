import {Router} from 'express';
import {getServices, addService, updateService, deactivateService, searchService, assignServiceToUser, removeServiceFromUser, getUserServices} from "./service.controller.js";
import {addServiceValidator, updateServiceValidator, deactivateServiceValidator, searchServiceValidator, assignServiceToUserValidator, removeServiceFromUserValidator, getUserServicesValidator} from "../middlewares/service-validators.js";
import { uploadServiceImage, handleUploadErrors } from '../middlewares/cloudinary-uploads.js';

const router = Router()

/**
 * @swagger
 * /service/:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: Servicios obtenidos correctamente
 *       404:
 *         description: No se encontraron servicios
 */
router.get("/", getServices);

/**
 * @swagger
 * /service/agregar:
 *   post:
 *     summary: Agregar un nuevo servicio
 *     tags: [Service]
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
 *         description: Servicio agregado correctamente
 *       500:
 *         description: Error al agregar el servicio
 */
router.post("/agregar", uploadServiceImage, handleUploadErrors, addServiceValidator, addService
)

/**
 * @swagger
 * /service/actualizar/{id}:
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
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
 *         description: Servicio actualizado correctamente
 *       404:
 *         description: Servicio no encontrado
 */
router.put("/actualizar/:id", uploadServiceImage, handleUploadErrors, updateServiceValidator, updateService
)

/**
 * @swagger
 * /service/desactivar/{id}:
 *   patch:
 *     summary: Activar o desactivar un servicio
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio activado/desactivado correctamente
 *       404:
 *         description: Servicio no encontrado
 */
router.patch("/desactivar/:id", deactivateServiceValidator, deactivateService);

/**
 * @swagger
 * /service/buscar/{name}:
 *   get:
 *     summary: Buscar servicios por nombre
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del servicio
 *     responses:
 *       200:
 *         description: Servicios encontrados
 *       404:
 *         description: No se encontraron servicios con ese nombre
 */
router.get("/buscar/:name", searchServiceValidator, searchService);

/**
 * @swagger
 * /service/asignar:
 *   post:
 *     summary: Asignar un servicio a un usuario
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Servicio asignado al usuario correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/asignar", assignServiceToUserValidator, assignServiceToUser);

/**
 * @swagger
 * /service/eliminar:
 *   delete:
 *     summary: Eliminar un servicio de un usuario
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Servicio eliminado del usuario correctamente
 *       400:
 *         description: Error de validación
 */
router.delete("/eliminar", removeServiceFromUserValidator, removeServiceFromUser);

/**
 * @swagger
 * /service/usuario/{userId}:
 *   get:
 *     summary: Obtener servicios de un usuario
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Servicios del usuario obtenidos correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/usuario/:userId", getUserServicesValidator, getUserServices);

export default router;