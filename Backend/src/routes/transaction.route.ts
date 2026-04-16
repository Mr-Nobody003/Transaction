import express from "express";
import { authMiddleware, systemUserAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createInitialUserFundsTransaction, createTransactionAcceptance, createTransactionController } from "../controllers/transaction.controller.js";


/**
 * @description Create new Transaction @Route POST api/v1/transactions/
 * @description Initialize System User Funds Transaction @Route POST api/v1/transactions/admin/initialize-funds
 * @protected route
 */
const transactionRouter = express.Router();


transactionRouter.post("/", authMiddleware, createTransactionController);
transactionRouter.post("/accept", authMiddleware, createTransactionAcceptance);
transactionRouter.post("/admin/initialize-funds", systemUserAuthMiddleware, createInitialUserFundsTransaction);

export default transactionRouter;