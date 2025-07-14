import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    userName: {
        type: String,
        required: [true, "User Name is required"]
    },
    numberAccount: {
        type: Number
    },
    dpi: {
        type: Number,
        required: [true, "DPI is required"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    workName: {
        type: String,
        required: [true, "Work name is required"],
    },
    monthEarnings: {
        type: Number,
        required: [true, "Month earnings is required"]
    },
    role: {
        type: String,
        enum: ["ADMIN_ROLE", "CLIENT_ROLE"],
        default: "CLIENT_ROLE"
    },
    historyOfSend: [{
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        default: []
    }],
    historyOfRecive: [{
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        default: []
    }],
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: []
    }],

    services: [{
        type: Schema.Types.ObjectId,
        ref: "Service",
        default: []
    }],


},
    {
        versionKey: false,
        timestamps: true
    }
);

userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default model("User", userSchema);
