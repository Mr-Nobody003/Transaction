import { Request, Response, NextFunction } from 'express';
import UserModel from "../models/user.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";



/**
 * 
 * @description check if user is valid and authorised 
 * @returns 
 */
async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            "message": "Unauthorize Access , Token Missing"
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await UserModel.findById(decode.userId)

        req.user = user;

        return next();
    }
    catch (err) {
        return res.status(401).json({
            "message": "Unauthorize Access , Token Invalid"
        });
    }
}

export { authMiddleware };