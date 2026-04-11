import express from "express";
import { userRegisterController, userLoginController, userLogoutController } from "../controllers/auth.controller.js";


/**
* @description Register @method POST @route - /api/v1/auth/register
* @description Login @method POST @route -  /api/v1/auth/login
* @description Logout @method POST @route -  /api/v1/auth/logout
* 
 */
const authRouter = express.Router();
authRouter.post("/register", userRegisterController);

authRouter.post("/login", userLoginController);

authRouter.post("/logout",userLogoutController);

export default authRouter;