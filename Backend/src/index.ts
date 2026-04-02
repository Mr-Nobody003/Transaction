import express from 'express';
import dotenv from 'dotenv';
import { connecttodb } from './config/db.js';
import router from './routes/auth.router.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port: number = 3000;
const authRouter = router;


app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);



app.get("/",(req,res)=>{
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

