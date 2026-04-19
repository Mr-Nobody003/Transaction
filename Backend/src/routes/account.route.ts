import express from "express";
import { authMiddleware, systemUserAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createAccountController, getAccountBalance, getUserAccountBalance, getUserAccountController } from "../controllers/account.controller.js";



/**
 * @description Create new Account @Route - POST api/v1/accounts/  , 
 * @description Get User Account @Route - GET api/v1/accounts/ ,
 * @description Get System User Account @Route - GET api/v1/accounts/system , 
 * @description Get User's own Account Balance @Route - GET api/v1/accounts/balance/:accountId 
 * @description Get Any User's Account Balance @Route - GET api/v1/accounts/system/balance/:accountId 
 * @protected route
 */
const accountRouter = express.Router();


accountRouter.post("/", authMiddleware, createAccountController);

accountRouter.get("/", authMiddleware, getUserAccountController);

accountRouter.get("/system", systemUserAuthMiddleware, getUserAccountController);

accountRouter.get("/balance/:accountId", authMiddleware, getAccountBalance);

accountRouter.get("/system/balance/:accountId", systemUserAuthMiddleware, getUserAccountBalance);

export default accountRouter;