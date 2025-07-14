import { Router } from "express";

import {
  createAccount,
  getAmountMoney,
  getMovementsByAccount,
  addFavoriteAccount,
} from "./wallet.controller.js";
import { getWalltValidator } from "../middlewares/wallet-validators.js";

const router = Router();

/**
 * @swagger
 * /wallet/create:
 *   post:
 *     summary: Crear una nueva cuenta de wallet
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Cuentas generadas correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
 */
router.post("/create", createAccount);

/**
 * @swagger
 * /wallet/balances/{userId}:
 *   get:
 *     summary: Obtener los saldos de las cuentas de un usuario
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Saldos obtenidos correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       404:
 *         description: Wallet no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/balances/:userId", getWalltValidator, getAmountMoney);

/**
 * @swagger
 * /wallet/movements/{userId}:
 *   get:
 *     summary: Obtener los movimientos de todas las cuentas de un usuario, ordenados de mayor a menor
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       404:
 *         description: Wallet no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/movements/:userId", getWalltValidator, getMovementsByAccount);

/**
 * @swagger
 * /wallet/addFavoriteAccount/{uid}:
 *   patch:
 *     summary: Agregar una cuenta a favoritos
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeAccount:
 *                 type: string
 *                 description: Tipo de cuenta a agregar a favoritos (noAccount, savingAccount, foreingCurrency)
 *     responses:
 *       200:
 *         description: Cuenta agregada a favoritos correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       404:
 *         description: Wallet no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/addFavoriteAccount/:uid", addFavoriteAccount);

export default router;
