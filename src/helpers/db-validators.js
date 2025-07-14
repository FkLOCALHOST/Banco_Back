import User from "../user/user.model.js";
import Transaction from "../transaction/transaction.model.js"
import Service from "../service/service.model.js"
import Product from "../product/product.model.js";

export const emailExist = async(email = "") =>{
    const exist = await User.findOne({email});
    if(exist){
        throw new Error(`The email ${email} is already registered`);
    }

};

export const userNameExist = async(userName = "") =>{
    const exist = await User.findOne({userName});
    if(exist){
        throw new Error(`The userName ${userName} is already registered`);
    }

}

export const uidExist = async(uid = "") =>{
    const exist = await User.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
};

export const transactionExist = async(uid = "") =>{
    const exist = await Transaction.findById(uid);
    if(!exist){
        throw new Error("No existe el ID proporcionado")
    }
}

export const serviceExist = async(name = "") =>{
    const exist = await Service.findOne({name})
    if(exist){
        throw new Error(`The service ${name} is already registered`);
    }
}

export const productExist = async(name = "") =>{
    const exist = await Product.findOne({name})
    if(exist){
        throw new Error(`The product ${name} is already registered`);
    }
}