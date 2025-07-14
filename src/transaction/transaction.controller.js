import mongoose from "mongoose";
import Transaction from "./transaction.model.js";
import User from "../user/user.model.js";
import Wallet from "../wallet/wallet.model.js";
import { validateTransactionDayLimit } from "../helpers/transaction-limitator.js";
import { convert } from "../converter/converter.controller.js";

const findReceiverUser = async (receiver) => {
    if (mongoose.Types.ObjectId.isValid(receiver)) {
        const user = await User.findById(receiver);
        if (user) return user;
    }

    if (typeof receiver === "string" && receiver.includes("@")) {
        const user = await User.findOne({ email: receiver });
        if (user) return user;
    }

    const accountNumber = Number(receiver);
    if (!isNaN(accountNumber)) {
        const wallet = await Wallet.findOne({
            $or: [
                { noAccount: accountNumber },
                { savingAccount: accountNumber },
                { foreingCurrency: accountNumber }
            ]
        });

        if (wallet) {
            const user = await User.findOne({ wallet: wallet._id });
            if (user) return user;
        }
    }

    return null;
};

export const createTransaction = async (req, res) => {
    try {
        const { receiver, sender, amount, typeSend, typeRecive, note = "" } = req.body;

        const numericAmount = Number(amount);
        if (!receiver || !sender || !typeSend || !typeRecive || isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ success: false, message: "Datos inválidos para realizar la transacción" });
        }

        const receiverUser = await findReceiverUser(receiver);
        const senderUser = await User.findById(sender);

        if (!receiverUser || !senderUser) {
            return res.status(404).json({ success: false, message: "Emisor o receptor no encontrado" });
        }

        const senderWallet = await Wallet.findById(senderUser.wallet);
        const receiverWallet = await Wallet.findById(receiverUser.wallet);

        const accountMap = {
            monetary: "noAccountBalance",
            saving: "savingAccountBalance",
            foreing: "foreingCurrencyBalance"
        };

        const typeAccountSend = accountMap[typeSend];
        const typeAccountReceiver = accountMap[typeRecive];

        if (senderWallet[typeAccountSend] < numericAmount) {
            return res.status(400).json({
                success: false,
                message: "Saldo insuficiente para realizar la transacción"
            });
        }

        try {
            await validateTransactionDayLimit(senderUser._id);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Límite diario alcanzado"
            });
        }

        let incrementAmount = numericAmount;
        let decrementAmount = numericAmount;

        if (typeAccountSend === "foreingCurrencyBalance" && typeAccountReceiver !== "foreingCurrencyBalance") {
            const conversion = await convert(numericAmount, "USD", "GTQ");
            if (conversion.error) {
                return res.status(500).json({ success: false, message: "Error al convertir de USD a GTQ" });
            }
            incrementAmount = parseInt(conversion.result);
        }

        if (typeAccountReceiver === "foreingCurrencyBalance" && typeAccountSend !== "foreingCurrencyBalance") {
            const conversion = await convert(numericAmount, "GTQ", "USD");
            if (conversion.error) {
                return res.status(500).json({ success: false, message: "Error al convertir de GTQ a USD" });
            }
            incrementAmount = parseInt(conversion.result);
        }

        await Promise.all([
            Wallet.findByIdAndUpdate(receiverWallet._id, {
                $inc: { [typeAccountReceiver]: incrementAmount }
            }),
            Wallet.findByIdAndUpdate(senderWallet._id, {
                $inc: { [typeAccountSend]: -decrementAmount }
            })
        ]);

        const transactionSucces = await Transaction.create({
            receiver: receiverUser._id,
            sender: senderUser._id,
            amount: numericAmount,
            type: typeRecive,
            typeSender: typeSend,
            note,
            status: "SUCCESS",
            date: new Date()
        });

        await Promise.all([
            User.findByIdAndUpdate(senderUser._id, { $addToSet: { historyOfSend: transactionSucces._id } }),
            User.findByIdAndUpdate(receiverUser._id, { $addToSet: { historyOfRecive: transactionSucces._id } })
        ]);

        res.status(201).json({
            success: true,
            message: "Transacción ejecutada con éxito",
            transactionSucces
        });

        const timeout = setTimeout(async () => {
            try {
                await Transaction.findByIdAndUpdate(transactionSucces._id, { status: "FINALLY" });
            } catch {
                console.log("Error al actualizar estado FINALLY");
            }
        }, 120000);

        const interval = setInterval(async () => {
            try {
                const updated = await Transaction.findById(transactionSucces._id);
                if (updated?.status === "REVERTED") {
                    clearTimeout(timeout);
                    clearInterval(interval);
                }
            } catch { }
        }, 5000);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al ejecutar la transacción",
            error: error.message
        });
    }
};

export const revertTransaction = async (req, res) => {
    try {
        const { uid } = req.params;

        const transaction = await Transaction.findById(uid);
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transacción no encontrada" });
        }

        if (transaction.status === "FINALLY") {
            return res.status(400).json({
                success: false,
                message: "No se puede revertir, tiempo límite excedido"
            });
        }

        if (transaction.status === "REVERTED") {
            return res.status(400).json({
                success: false,
                message: "La transacción ya fue revertida"
            });
        }

        const accountMap = {
            monetary: "noAccountBalance",
            saving: "savingAccountBalance",
            foreing: "foreingCurrencyBalance"
        };

        const accountReceiver = accountMap[transaction.type];
        const accountSender = accountMap[transaction.typeSender];

        const senderUser = await User.findById(transaction.sender);
        const receiverUser = await User.findById(transaction.receiver);

        const senderWallet = await Wallet.findById(senderUser.wallet);
        const receiverWallet = await Wallet.findById(receiverUser.wallet);

        await Transaction.findByIdAndUpdate(uid, { status: "REVERTED" });

        await Promise.all([
            Wallet.findByIdAndUpdate(receiverWallet._id, {
                $inc: { [accountReceiver]: -transaction.amount }
            }),
            Wallet.findByIdAndUpdate(senderWallet._id, {
                $inc: { [accountSender]: transaction.amount }
            })
        ]);

        return res.status(200).json({
            success: true,
            message: "Transacción revertida con éxito"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al ejecutar la reversión",
            error: error.message
        });
    }
};


export const getTransacionHistory = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const total = await User.countDocuments(query);

        const users = await User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('historyOfSend')
            .populate('historyOfRecive')
            .select('historyOfSend historyOfRecive name userName email');

        return res.status(200).json({
            success: true,
            total,
            users,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener usuarios con detalles de transacciones",
            error: err.message,
        });
    }
}


export const depositTransaction = async (req, res) => {
    try {
        const { receiver, sender, amount, type } = req.body;

        const findReceiverUser = async (receiver) => {
            if (mongoose.Types.ObjectId.isValid(receiver)) {
                const user = await User.findById(receiver);
                if (user) return user;
            }

            if (typeof receiver === "string" && receiver.includes("@")) {
                const user = await User.findOne({ email: receiver });
                if (user) return user;
            }

            const accountNumber = Number(receiver);
            if (!isNaN(accountNumber)) {
                const wallet = await Wallet.findOne({
                    $or: [
                        { noAccount: accountNumber },
                        { savingAccount: accountNumber },
                        { foreingCurrency: accountNumber }
                    ]
                });

                if (wallet) {
                    const user = await User.findOne({ wallet: wallet._id });
                    if (user) return user;
                }
            }

            return null;
        };

        const receiverUser = await findReceiverUser(receiver);
        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario receptor no encontrado",
            });
        }

        const receiverWallet = await Wallet.findById(receiverUser.wallet);
        if (!receiverWallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet del receptor no encontrada",
            });
        }

        const typeSender = "Deposit";
        const typeOfAccount = {
            monetary: "noAccountBalance",
            saving: "savingAccountBalance",
            foreing: "foreingCurrencyBalance",
        };

        const typeAcountField = typeOfAccount[type];
        if (!typeAcountField) {
            return res.status(400).json({
                success: false,
                message: "Tipo de cuenta inválido",
            });
        }

        await Wallet.findByIdAndUpdate(receiverWallet._id, { $inc: { [typeAcountField]: amount } }, { new: true });

        const transactionDeposit = await Transaction.create({
            receiver: receiverUser._id, 
            sender,
            amount,
            type,
            typeSender,
        });

        await User.findByIdAndUpdate(receiverUser._id, { $addToSet: { historyOfRecive: transactionDeposit._id } });

        return res.status(201).json({
            success: true,
            message: "Deposito realizado con éxito",
            transactionDeposit,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al ejecutar el deposito",
            error: error.message,
        });
    }
};

export const updateDepositTransaction = async (req, res) => {
    try {
        const { uid } = req.params
        const { amount } = req.body

        const transaction = await Transaction.findByIdAndUpdate(uid, { amount: amount }, { new: true })
        res.status(200).json({
            success: true,
            message: "Deposito Actualizado con éxito",
            transaction
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el deposito",
            error: error.message
        })
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const { uid } = req.params;
        const { amount } = req.body;

        const transaction = await Transaction.findById(uid);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transacción no encontrada"
            });
        }

        const senderUser = await User.findById(transaction.sender);
        const receiverUser = await User.findById(transaction.receiver);
        const senderWallet = await Wallet.findById(senderUser.wallet);
        const receiverWallet = await Wallet.findById(receiverUser.wallet);

        const typeOfAccountSender = {
            monetary: "noAccountBalance",
            saving: "savingAccountBalance",
            foreing: "foreingCurrencyBalance"
        };

        const typeOfAccountReceiver = {
            monetary: "noAccountBalance",
            saving: "savingAccountBalance",
            foreing: "foreingCurrencyBalance"
        };

        const typeAccountSend = typeOfAccountSender[transaction.typeSender];
        const typeAccountReceiver = typeOfAccountReceiver[transaction.type];

        const difference = amount - transaction.amount;

        if (difference < 0) {
            if (senderWallet[typeAccountSend] < Math.abs(difference)) {
                return res.status(400).json({
                    success: false,
                    message: "El balance para efectuar la actualización es insuficiente"
                });
            }
            await Promise.all([
                Wallet.findByIdAndUpdate(receiverWallet._id, { $inc: { [typeAccountReceiver]: -Math.abs(difference) } }, { new: true }),
                Wallet.findByIdAndUpdate(senderWallet._id, { $inc: { [typeAccountSend]: Math.abs(difference) } }, { new: true }),
            ]);
        } else {
            if (receiverWallet[typeAccountReceiver] < Math.abs(difference)) {
                return res.status(400).json({
                    success: false,
                    message: "El balance para efectuar la actualización es insuficiente"
                });
            }
            await Promise.all([
                Wallet.findByIdAndUpdate(receiverWallet._id, { $inc: { [typeAccountReceiver]: Math.abs(difference) } }, { new: true }),
                Wallet.findByIdAndUpdate(senderWallet._id, { $inc: { [typeAccountSend]: -Math.abs(difference) } }, { new: true }),
            ]);
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(uid, { amount: amount }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Transacción actualizada con éxito",
            updatedTransaction
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la transacción",
            error: error.message
        });
    }
};