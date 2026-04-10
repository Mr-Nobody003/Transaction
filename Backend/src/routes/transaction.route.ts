import express from "express";
import { authMiddleware, systemUserAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createInitialUserFundsTransaction, createTransactionController } from "../controllers/transaction.controller.js";


/**
 * @description Create new Transaction
 * @Route  POST api/v1/transactions/
 * @protected route
 */
const transactionRouter = express.Router();


transactionRouter.post("/", authMiddleware, createTransactionController);

transactionRouter.post("/admin/initialize-funds", systemUserAuthMiddleware, createInitialUserFundsTransaction);

export default transactionRouter;