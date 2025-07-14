import {Schema, model} from 'mongoose';

const productSchema = Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        default: 0
    },
    category: {
        type: String,
        enum: ["SEGUROS", "TARJETA", "PLANES", "PRESTAMOS", "PROMOCION"],
        required: [true, "Product category is required"]
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    }

},
    {
        versionKey: false,
        timestamps: true
    }
)


productSchema.methods.toJSON = function () {
    const { __v, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

export default model("Product", productSchema);