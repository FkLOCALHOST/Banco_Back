import {Schema, model} from 'mongoose';

const serviceSchema = Schema({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    description: {
        type: String,
        required: [true, "Service description is required"]
    },
    price: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ["Servicios_Basicos", "Educacion", "Instituciones","Apoyo_Externo"],
        default: "Apoyo_Externo"
    },
    image: {
        type: String
    }
},
{
    versionKey: false,
    timestamps: true
});

serviceSchema.methods.toJSON = function () {
    const { _v, _id, ...service } = this.toObject();
    service.uid = _id;
    return service;
}

export default model("Service", serviceSchema);