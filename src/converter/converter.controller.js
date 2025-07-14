import { config } from "dotenv";
import axios from "axios";

config();

export const convert = async (amount, base, target) => {
    const apiKey = process.env.KEY_EXCHANGE;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${target}/${amount}`;

    try {
        const response = await axios.get(url);

        if (response?.data?.result !== "success") {
            return {
                error: "Error al convertir la moneda"
            };
        }

        return {
            result: response.data.conversion_result
        };

    } catch (error) {
        return {
            error: "Error al conectar con el servicio de conversión"
        };
    }
};