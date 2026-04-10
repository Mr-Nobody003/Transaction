import express from "express";
import { authMiddleware, systemUserAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createAccountController, getUserAccountController } from "../controllers/account.controller.js";



/**
 * @description Create new Account
 * @Route  POST api/v1/accounts/ 
 * @protected route
 */
const accountRouter = express.Router();


accountRouter.post("/", authMiddleware, createAccountController);

accountRouter.get("/", systemUserAuthMiddleware, getUserAccountController);

export default accountRouter;