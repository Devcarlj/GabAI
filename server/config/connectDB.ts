import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function connectDB(): Promise<typeof mongoose | undefined> {
    // If already connected, return immediately
    if (mongoose.connection.readyState >= 1) {
        return mongoose as typeof mongoose;
    }

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing from environment variables");
        return;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB is now connected");
        return connection;
    } catch (error) {
        console.error("MongoDB connection error details:", error);
        // During development/local server, we exit if DB connection fails
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

export default connectDB;