import express from "express";
import { userRegisterController, userLoginController } from "../controllers/auth.controller.js";


/**
* @description Register route - POST /api/v1/auth/register
* @description Login route - POST /api/v1/auth/login
 */
const authRouter = express.Router();
authRouter.post("/register", userRegisterController);


authRouter.post("/login", userLoginController);

export default authRouter;