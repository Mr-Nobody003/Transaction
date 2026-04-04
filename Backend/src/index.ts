import express from 'express';
import dotenv from 'dotenv';
import { connecttodb } from './config/db.js';
import cookieParser from 'cookie-parser';

/**
 * @description Import Routes
 */
import authRouter from './routes/auth.route.js';
import accountRouter from './routes/account.route.js';
import transactionRouter from './routes/transaction.route.js';

dotenv.config();

const app = express();
const port: number = 3000;


app.use(express.json());
app.use(cookieParser());

/**
 * @description use Routes
 */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1/transactions",transactionRouter);


app.get("/", (req, res) => {
    res.send("Hello World");
});






async function startServer() {
    try {
        await connecttodb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();