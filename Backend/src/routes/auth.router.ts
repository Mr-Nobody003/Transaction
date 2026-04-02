import express from "express";
import { userRegisterController,userLoginController } from "../controllers/auth.controller.js";

const router = express.Router();

/**
* @description Register route - POST /api/v1/auth/register
*/
router.post("/register", userRegisterController);

/**
 * @description Login route - POST /api/v1/auth/login
 */
router.post("/login",userLoginController);




export default router;