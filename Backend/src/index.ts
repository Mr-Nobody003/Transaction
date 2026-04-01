import express from 'express';
import dotenv from 'dotenv';
import { connecttodb } from './config/db.js';
dotenv.config();

const app = express();
const port: number = 3000;

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

