import User from "../user/user.model.js";
import { hash } from "argon2";

export const userSeeder = async () => {
    try {
        const existingUser = await User.findOne({ userName: "ADMINB" });

        if (existingUser) {
            throw new Error("Ya existe el administrador");
        }

        const encryptedPass = await hash("ADMINB");

        await User.create({
            name: "ADMINB",
            userName: "ADMINB",
            dpi: 0,
            address: "Zona 7, Guatemala",
            phone: "00000000",
            email: "ADMINB@bancoguate.org.gt",
            password: encryptedPass,
            workName: "Worker",
            monthEarnings: 9999,
            role: "ADMIN_ROLE"
        });

        console.log("Administrador creado correctamente");
    } catch (error) {
        console.error(`Error al crear el administrador: ${error.message}`);
    }
};
