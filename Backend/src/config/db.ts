import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connecttodb(): Promise<void> { 
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (err) { 
        console.error("Could not connect to MongoDB", err);
        process.exit(1);
    }
}