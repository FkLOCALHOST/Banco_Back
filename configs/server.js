"use strict";

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import { connectionDB } from "./mongo.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import walletRoutes from "../src/wallet/wallet.routes.js";
import productRoutes from "../src/product/product.routes.js";
import serviceRoutes from "../src/service/service.routes.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import transactionRoutes from "../src/transaction/transaction.routes.js";
import { userSeeder } from "../src/seeders/user.seeder.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://bank-front-deploy.web.app"
];


const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

const middlewares = (app) => {
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("dev"));
};

const routes = (app) => {
  app.use("/walletManager/v1/auth", authRoutes);
  app.use("/walletManager/v1/user", userRoutes);
  app.use("/walletManager/v1/wallet", walletRoutes);
  app.use("/walletManager/v1/product", productRoutes);
  app.use("/walletManager/v1/service", serviceRoutes);
  app.use("/walletManager/v1/transaction", transactionRoutes);
  app.use("/walletManager/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

const connectionMongo = async () => {
  try {
    await connectionDB();
  } catch (error) {
    console.log(`Data Base connection failed: ${error}`);
  }
};

export const initServer = () => {
  const app = express();
  const timeInit = Date.now();
  try {
    userSeeder();
    middlewares(app);
    connectionMongo();
    routes(app);
    app.listen(process.env.PORT);
    const elapsedTime = Date.now() - timeInit;
    console.log(`Server running on port ${process.env.PORT} (${elapsedTime}ms)`);
  } catch (error) {
    console.log(`Server failed to start: ${error}`);
  }
};