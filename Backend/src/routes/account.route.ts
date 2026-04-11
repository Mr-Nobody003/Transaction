import express from "express";
import { authMiddleware, systemUserAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createAccountController, getAccountBalance, getUserAccountController } from "../controllers/account.controller.js";



/**
 * @description Create new Account @Route - POST api/v1/accounts/  , 
 * @description Get System User Account @Route - GET api/v1/accounts/ , 
 * @description Get Account Balance @Route - GET api/v1/accounts/balance/:accountId 
 * @protected route
 */
const accountRouter = express.Router();


accountRouter.post("/", authMiddleware, createAccountController);

accountRouter.get("/", systemUserAuthMiddleware, getUserAccountController);

accountRouter.get("/balance/:accountId", authMiddleware, getAccountBalance);

export default accountRouter;