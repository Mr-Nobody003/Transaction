import express from "express";
import { authMiddleware, systemUserAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createInitialUserFundsTransaction, createTransactionAcceptance, createTransactionController } from "../controllers/transaction.controller.js";


/**
 * @description Create new Transaction @Route POST api/v1/transactions/send-funds
 * @description Accept Transaction @Route POST api/v1/transactions/accept
 * @description Initialize System User Funds Transaction @Route POST api/v1/transactions/system/initialize-funds
 * @protected route
 */
const transactionRouter = express.Router();


transactionRouter.post("/accept", authMiddleware, createTransactionAcceptance);
transactionRouter.post("/send-funds", authMiddleware, createTransactionController);
transactionRouter.post("/system/initialize-funds", systemUserAuthMiddleware, createInitialUserFundsTransaction);

export default transactionRouter;