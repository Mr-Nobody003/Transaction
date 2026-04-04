import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTransactionController } from "../controllers/transaction.controller.js";


/**
 * @description Create new Transaction
 * @Route  POST api/v1/transactions/
 * @protected route
 */
const transactionRouter = express.Router();


transactionRouter.post("/", authMiddleware, createTransactionController);

export default transactionRouter;