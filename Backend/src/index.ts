import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

/**
 * @description Import Routes
 */
import authRouter from './routes/auth.route.js';
import accountRouter from './routes/account.route.js';
import transactionRouter from './routes/transaction.route.js';

dotenv.config();

/**
 * @version - v1
 */
const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * @description use Routes @version - v1
 */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1/transactions", transactionRouter);


app.get("/", (req, res) => {
    res.send("Transaction API is LIVE");
});

export default app;