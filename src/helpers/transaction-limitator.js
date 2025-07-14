import User from "../user/user.model.js"
import Transaction from "../transaction/transaction.model.js"

export const validateTransactionDayLimit = async (senderId) => {
    const user = await User.findById(senderId);
    if (!user) throw new Error("Usuario no encontrado");

    let totalAmountToday = 0;
    const today = new Date();

    for (const transactionId of user.historyOfSend) {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) continue;

        const transactionDate = new Date(transaction.date);

        const isSameDay =
            transactionDate.getDate() === today.getDate() &&
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear();

        if (isSameDay) {
            totalAmountToday += transaction.amount;
        }

        if (totalAmountToday > 10000) {
            throw new Error("Límite diario excedido");
        }
    }
};
