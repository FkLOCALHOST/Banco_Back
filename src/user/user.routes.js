import { Router } from "express";
import { getUserById, getUsersTransaction, getWallet, getBalance, getUsers, updatePassword, updateUser, deleteUser, getHistory, addFavorite, getFavorites } from "./user.controller.js";
import { getUserByIdValidator, updatePasswordValidator, updateUserValidator, deleteUserValidator, addFavoriteValidator, getFavoritesValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * /user/getUserById/{uid}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get(
    "/getUserById/:uid",
    getUserByIdValidator,
    getUserById
);

/**
 * @swagger
 * /user/getUser:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
    "/getUser",
    getUsers
);

/**
 * @swagger
 * /user/updatePassword/{uid}:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Bad request
 */
router.patch(
    "/updatePassword/:uid",
    updatePasswordValidator,
    updatePassword
);

/**
 * @swagger
 * /user/updateUser/{uid}:
 *   patch:
 *     summary: Update user information
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Bad request
 */
router.patch(
    "/updateUser/:uid",
    updateUserValidator,
    updateUser
);

/**
 * @swagger
 * /user/deleteUser/{uid}:
 *   patch:
 *     summary: Delete user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.patch(
    "/deleteUser/:uid",
    deleteUserValidator,
    deleteUser
);

/**
 * @swagger
 * /user/getHistoryOfTransactions/{uid}:
 *   get:
 *     summary: Obtener historial de transacciones del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Historial de transacciones obtenido correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
    "/getHistoryOfTransactions/:uid",
    getHistory
);

/**
 * @swagger
 * /user/addFavorite:
 *   post:
 *     summary: Agregar un producto o servicio a favoritos del usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorito agregado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/addFavorite', addFavoriteValidator, addFavorite);

/**
 * @swagger
 * /user/Favorites:
 *   get:
 *     summary: Obtener los favoritos del usuario
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Favoritos obtenidos correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/Favorites', getFavoritesValidator, getFavorites);

router.get(
    "/getBalance/:uid",
    getBalance
)

router.get(
    "/getWallet/:uid",
    getWallet
)

router.get(
    "/getUserTransactions/",
    getUsersTransaction
)

export default router;