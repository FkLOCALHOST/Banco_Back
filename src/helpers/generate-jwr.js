import jwt from "jsonwebtoken";
import { token } from "morgan";

export const generateJWT = (uid = " ") =>{
    return new Promise((resolve,reject) =>{
        const payload = {uid}

        jwt.sign(
            payload,
            process.env.SECRET_OR_PRIVATE_KEY,
            {
                expiresIn: "1h"
            },
            (err, token) =>{
                if(err){
                    reject({
                        succes: false,
                        message: err
                    })
                }else{
                    resolve(token);
                };
            }
        )
    }) 
}