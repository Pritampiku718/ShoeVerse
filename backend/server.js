import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

/* ============================================
   ✅ Setup __dirname for ES Modules
============================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================================
   ✅ Load Environment Variables FIRST
============================================ */
console.log("📁 Loading environment variables...");
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("📊 Environment check:");
console.log(`   PORT: ${process.env.PORT || "Not set (default 5000)"}`);
console.log(
  `   MONGO_URI: ${process.env.MONGO_URI ? "✅ Found" : "❌ Not found"}`
);
console.log(
  `   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Found" : "❌ Not found"}`
);

/* ============================================
   ✅ Connect MongoDB Atlas
============================================ */
connectDB();

/* ============================================
   ✅ Initialize Express App
============================================ */
const app = express();

/* ============================================
   ✅ Create Uploads Folder Automatically
============================================ */
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Uploads directory created");
}

/* ============================================
   ✅ CORS Configuration (FINAL FIX - NO ERRORS)
   Works with Render + Vercel + Preview URLs
============================================ */
app.use(
  cors({
    origin: true, // ✅ Allow all origins automatically
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ============================================
   ✅ Body Parser Middleware
============================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================================
   ✅ Static Folder for Uploaded Images
============================================ */
app.use("/uploads", express.static(uploadDir));

/* ============================================
   ✅ Request Logger (Debugging)
============================================ */
app.use((req, res, next) => {
  console.log(`📌 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
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
   ✅ Root Route Fix (So Render URL Works)
============================================ */
app.get("/", (req, res) => {
  res.send("🚀 ShoeVerse Backend API Running Successfully!");
});

/* ============================================
   ✅ Health Check Route
============================================ */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ShoeVerse API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ============================================
   ✅ Test Route
============================================ */
app.get("/api/test", (req, res) => {
  res.json({
    message: "Test endpoint is working!",
    env: {
      port: process.env.PORT,
      mongo_uri_set: !!process.env.MONGO_URI,
      node_env: process.env.NODE_ENV || "development",
    },
  });
});

/* ============================================
   ✅ 404 Route Handler
============================================ */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found ❌",
    method: req.method,
    path: req.url,
  });
});

/* ============================================
   ✅ Global Error Handler
============================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/* ============================================
   ✅ Start Server (Render Uses process.env.PORT)
============================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 SERVER STARTED SUCCESSFULLY");
  console.log("=".repeat(50));
  console.log(`📍 Running on Port: ${PORT}`);
  console.log(`📍 Health Check: /api/health`);
  console.log(`📍 Products API: /api/products`);
  console.log(`📍 Uploads Folder: ${uploadDir}`);
  console.log("=".repeat(50) + "\n");
});
