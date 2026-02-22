import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

/* ============================================
   ✅ Setup __dirname (ES Module Fix)
============================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================================
   ✅ Load Environment Variables FIRST
============================================ */
dotenv.config({ path: path.join(__dirname, ".env") });

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

/* ============================================
   ✅ Connect MongoDB
============================================ */
connectDB();

/* ============================================
   ✅ Initialize Express
============================================ */
const app = express();

/* ============================================
   ✅ Security Middlewares (Premium Setup)
============================================ */
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression

// Rate Limiting (Prevent Abuse / DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500, // Max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

/* ============================================
   ✅ Advanced CORS Configuration
============================================ */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
   "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS Not Allowed ❌"));
    },
    credentials: true,
  })
);

/* ============================================
   ✅ Body Parser
============================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================================
   ✅ Logger (Dev vs Prod)
============================================ */
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

/* ============================================
   ✅ Auto Create Uploads Folder
============================================ */
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

/* ============================================
   ✅ Health & Root Routes
============================================ */
app.get("/", (req, res) => {
  res.send("🚀 ShoeVerse Premium Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ============================================
   ✅ API Routes
============================================ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

/* ============================================
   ✅ 404 Handler
============================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found ❌",
  });
});

/* ============================================
   ✅ Global Error Handler
============================================ */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

/* ============================================
   ✅ Graceful Shutdown (Premium Feature)
============================================ */
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
  process.exit(1);
});

/* ============================================
   ✅ Start Server
============================================ */
const server = app.listen(PORT, () => {
  console.log("\n====================================");
  console.log("🚀 ShoeVerse Server Started");
  console.log("🌍 Environment:", NODE_ENV);
  console.log("📍 Port:", PORT);
  console.log("====================================\n");
});