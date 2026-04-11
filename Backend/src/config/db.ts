import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connection cache for Vercel serverless environment
let isConnected = false;

export async function connecttodb(): Promise<void> {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0]?.readyState === 1;
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Could not connect to MongoDB", err);
        throw err;
    }
}