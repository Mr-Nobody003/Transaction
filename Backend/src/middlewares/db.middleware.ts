import { Request, Response, NextFunction } from 'express';
import { connecttodb } from '../config/db.js';

export const dbMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connecttodb();
        next();
    } catch (err) {
        console.error("Database connection middleware error:", err);
        res.status(500).json({
            message: "Database connection failed",
            error: err instanceof Error ? err.message : String(err),
            status: "Error"
        });
    }
};
