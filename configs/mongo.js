'use strict'

import mongoose from "mongoose";

export const connectionDB = async() =>{
    try {
        mongoose.connection.on("error", ()=>{
            console.log("MongoDB | Could not be connect to MongoDb");
            mongoose.disconnect();
        })
        mongoose.connection.on("connecting", ()=>{
            console.log("MongoDb | Try connecting");
        })
        mongoose.connection.on("connected", () =>{
            console.log("MongoDb | Conecting to mongoDb...");
        })
        mongoose.connection.on("open", ()=>{
            console.log("MongoCB | The connection is successful to the database")
        })
        mongoose.connection.on("reconnected", () =>{
            console.log("MongoDB| Reconected to mongoDB")
        })
        mongoose.connection.on("disconnected", ()=>{
            console.log((`MOngoSb | Disconnected to mongo DB`))
        })
        await mongoose.connect(process.env.URI_DATABASE,{
            serverSelectionTimeoutMS: 2000,
            maxPoolSize:50
        })
    } catch (er) {
        console.log(`Database connection failed \n ${er}`);
    }
};