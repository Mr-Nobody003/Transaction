import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAccountController } from "../controllers/account.controller.js";



/**
 * @description Create new Account
 * @Route  POST api/v1/accounts/ 
 * @protected route
 */
const accountRouter = express.Router();


accountRouter.post("/", authMiddleware, createAccountController);

export default accountRouter;