import { Schema, model } from "mongoose";

const walletSchema = Schema(
  {
    noAccount: {
      type: Number,
    },
    // saldo de la cuenta monetaria
    noAccountBalance: {
      type: Number,
      default: 0,
    },
    // cuenta de ahorros
    savingAccount: {
      type: Number,
    },
    // saldo de la cuenta de ahorros
    savingAccountBalance: {
      type: Number,
      default: 0,
    },
    // cuenta de divisas extranjeras
    foreingCurrency: {
      type: Number,
    },
    // saldo de la cuenta de divisas extranjeras
    foreingCurrencyBalance: {
      type: Number,
      default: 0,
    },
    noAccountMovements: {
      type: Number,
      default: 0,
    },
    savingAccountMovements: {
      type: Number,
      default: 0,
    },
    foreingCurrencyMovements: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    favoriteAccount:[{
        type: Number
    }],
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

walletSchema.methods.toJSON = function () {
  const { _v, _id, ...wallet } = this.toObject();
  wallet.uid = _id;
  return wallet;
};

export default model("Wallet", walletSchema);
