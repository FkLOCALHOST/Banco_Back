import { Router } from "express";
import { createTransaction, revertTransaction , getTransacionHistory,depositTransaction, updateDepositTransaction, updateTransaction} from "./transaction.controller.js";
import { createTransactionValidator } from "../middlewares/transaction-validator.js";

const router = Router()

/**
 * @swagger
 * /transaction/createTransaction:
 *   post:
 *     summary: Crear una nueva transacción
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiver:
 *                 type: string
 *               sender:
 *                 type: string
 *               amount:
 *                 type: number
 *               typeSend:
 *                 type: string
 *               typeRecive:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transacción ejecutada con éxito
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error al ejecutar la transacción
 */
router.post(
    "/createTransaction",
    createTransactionValidator,
    createTransaction
)

/**
 * @swagger
 * /transaction/revertTransaction/{uid}:
 *   patch:
 *     summary: Revertir una transacción
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Transacción revertida con éxito
 *       400:
 *         description: No se puede revertir la transacción
 *       500:
 *         description: Error al ejecutar la reversión
 */
router.patch(
    "/revertTransaction/:uid",
    revertTransaction
)

/**
 * @swagger
 * /transaction/depositTransaction:
 *   post:
 *     summary: Realizar un depósito
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiver:
 *                 type: string
 *               sender:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Depósito realizado con éxito
 *       500:
 *         description: Error al ejecutar el depósito
 */
router.post(
    "/depositTransaction",
    depositTransaction
)

/**
 * @swagger
 * /transaction/updateDeposit/{uid}:
 *   patch:
 *     summary: Actualizar un depósito
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del depósito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Depósito actualizado con éxito
 *       500:
 *         description: Error al actualizar el depósito
 */
router.patch(
    "/updateDeposit/:uid",
    updateDepositTransaction
)

/**
 * @swagger
 * /transaction/updateTransaction/{uid}:
 *   patch:
 *     summary: Actualizar una transacción
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transacción actualizada con éxito
 *       404:
 *         description: Transacción no encontrada
 *       500:
 *         description: Error al actualizar la transacción
 */
router.patch(
    "/updateTransaction/:uid",
    updateTransaction
)

router.get(
    "/getTransacionHistory/:uid",
    getTransacionHistory
)

export default router