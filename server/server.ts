import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import ticketRoutes from "./routes/ticket.route.js";
import authRouter from "./routes/user.route.js"; // 👈 1. IMPORT YOUR USER ROUTES HERE
import geocodeRoutes from "./routes/geocode.route.js"; // 👈 Reverse-geocode proxy for the GPS feature

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI environment variable');
  process.exit(1);
}

// 1. Precise CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 2. Body Parser Middleware
// server.ts
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // in case you ever send form-urlencoded too

// 3. Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

// 4. API Routes
app.use('/api', ticketRoutes);
app.use('/api', geocodeRoutes); // -> GET /api/geocode?lat=..&lng=..
app.use('/api/auth', authRouter); // 👈 2. MOUNT AUTH ROUTER HERE (This maps routes to /api/auth/*)

// 5. Fallback 404 Route
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl} - Route not found` });
});

// 6. Connect to DB and Start Listening
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });