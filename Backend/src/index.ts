import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

/**
 * @description Import Routes
 */
import authRouter from './routes/auth.route.js';
import accountRouter from './routes/account.route.js';
import transactionRouter from './routes/transaction.route.js';
import { dbMiddleware } from './middleware/db.middleware.js';

dotenv.config();

/**
 * @version - v1
 */
const app = express();

app.use(express.json());
app.use(cookieParser());

// Database connection readiness middleware
app.use(dbMiddleware);

/**
 * @description use Routes @version - v1
 */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1/transactions", transactionRouter);


app.get("/", (req, res) => {
    res.send("Transaction API is LIVE");
});

/**
 * @description Global Error Handler for Diagnostics
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({
        message: "Internal Server Error (Vercel Diagnostic)",
        error: err.message || "Unknown Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        status: "Error"
    });
});

export default app;