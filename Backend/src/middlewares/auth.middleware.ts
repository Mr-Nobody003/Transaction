import { Request, Response, NextFunction } from 'express';
import UserModel from "../models/user.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import TokenBlacklistModel from '../models/token.blacklist.model.js';




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

    const blacklistedToken = await TokenBlacklistModel.findOne({ token: token });

    if (blacklistedToken) { 
        return res.status(401).json({
            "message": "Unauthorize Access , Token is blacklisted"
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await UserModel.findById(decode.userId)
        if (!user) {

            return res.status(401).json({
                "message": "Unauthorize Access , User Not Found , Suspicious Token"
            });
        }
        req.user = user;

        return next();
    }
    catch (err) {
        return res.status(401).json({
            "message": "Unauthorize Access , Token Invalid"
        });
    }
}

/**
 * 
 * @description check if user is system user or not
 * @returns 
 */
async function systemUserAuthMiddleware(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            "message": "Unauthorize Access , Token Missing"
        });
    }

    const blacklistedToken = await TokenBlacklistModel.findOne({ token: token });

    if (blacklistedToken) { 
        return res.status(401).json({
            "message": "Unauthorize Access , Token is blacklisted"
        });
    }

    
    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await UserModel.findById(decode.userId).select("+systemUser");

    if (!user) {
        return res.status(401).json({
            "message": "Unauthorize Access , User Not Found"
        });
    }
    if (!user.systemUser) {
        return res.status(403).json({
            "message": "Forbidden Access , User is not a system user"
        });
    }

    req.user = user;

    return next();
}


export { authMiddleware, systemUserAuthMiddleware };