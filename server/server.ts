import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import ticketRoutes from "./routes/ticket.route.js";
import authRouter from "./routes/user.route.js"; // 👈 1. IMPORT YOUR USER ROUTES HERE
import geocodeRoutes from "./routes/geocode.route.js"; // 👈 Reverse-geocode proxy for the GPS feature

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI environment variable");
  process.exit(1);
}

// 1. CORS — allow localhost plus LAN/private-network dev origins
const isProduction = process.env.NODE_ENV === "production";
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

const localDevOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/;

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;
  return !isProduction && localDevOriginPattern.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, origin ?? true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    credentials: true,
  }),
);

// 2. Body Parser Middleware
// server.ts
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // in case you ever send form-urlencoded too

// 3. Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

// Vercel invokes the exported app as a serverless function. Every other
// environment, including local runs with NODE_ENV=production, needs a port.
if (!process.env.VERCEL) {
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

let connectionPromise: Promise<typeof mongoose> | null = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGODB_URI!, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .then((connection) => {
        console.log("✅ Connected to MongoDB successfully!");
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  try {
    const connection = await connectionPromise;
    connectionPromise = null;
    return connection;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }
}

// Every API request waits for the same connection attempt. This avoids a
// request racing the initial MongoDB connection or opening duplicate clients.
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed before request:", error);
    res.status(503).json({ error: "Database connection unavailable. Please try again shortly." });
  }
});

// 4. API Routes
app.use("/api", ticketRoutes);
app.use("/api", geocodeRoutes); // -> GET /api/geocode?lat=..&lng=..
app.use("/api/auth", authRouter); // -> /api/auth/*

// 5. Fallback 404 Route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

export default app;
