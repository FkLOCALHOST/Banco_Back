    import { Schema, model } from "mongoose";

    const transactionSchema = Schema({
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number
        },
        type: {
            type: String
        },
        typeSender:{
            type: String
        },
        date: {
            type: Date,
            default: new Date()
        },
        status: {
            type: String,
            enum: ["SUCCESS","FINALLY","REVERTED"],
            default: "SUCCESS"
        }
    },
        {
            versionKey: false,
            timestamps: true
        }
    );

    transactionSchema.methods.toJSON = function () {
        const { __v, _id, ...transaction } = this.toObject();
        transaction.uid = _id;
        return transaction;
    }

    export default model("Transaction", transactionSchema);
