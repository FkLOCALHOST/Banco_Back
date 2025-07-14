import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Wallet Manager API",
            version: "1.0.0",
            description: "API documentation for the Wallet Manager System",
        },
        servers: [
            {
                url: "http://localhost:3005/walletManager/v1",
            },
        ],
    },
    apis: ["./src/**/*.routes.js"],
};
const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };
