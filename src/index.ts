import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes"
import { connectDB } from "./config/database";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  console.log("Health check route hit");
  res.json({ status: "OK", message: "Server is running" });
});

// general rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat",chatRoutes)

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
