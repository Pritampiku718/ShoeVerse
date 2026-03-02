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
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

//Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Load Environment Variables FIRST
dotenv.config({ path: path.join(__dirname, ".env") });

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Validate critical environment variables
if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

//Connect MongoDB
connectDB();

//Initialize Express & HTTP Server
const app = express();
const httpServer = createServer(app);

//Socket.io Setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  FRONTEND_URL,
];

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes(".vercel.app") ||
        origin.includes(".netlify.app")
      ) {
        callback(null, true);
      } else {
        console.warn(`Socket CORS blocked origin: ${origin}`);
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: false,
});

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.token;

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role || "user";
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id} (User: ${socket.userId})`);

  if (socket.userRole === "admin") {
    socket.join("admin");
    console.log(`Admin joined admin room: ${socket.userId}`);
  }

  socket.join(`user-${socket.userId}`);
  console.log(`User joined personal room: ${socket.userId}`);

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} (Reason: ${reason})`);
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("subscribe-to-order", (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Subscribed to order updates: ${orderId}`);
  });

  socket.on("unsubscribe-from-order", (orderId) => {
    socket.leave(`order-${orderId}`);
    console.log(`Unsubscribed from order updates: ${orderId}`);
  });

  socket.on("user-online", () => {
    io.emit("user-status", { userId: socket.userId, status: "online" });
  });

  socket.on("user-offline", () => {
    io.emit("user-status", { userId: socket.userId, status: "offline" });
  });
});

// Make io available to routes
app.set("io", io);

//Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(compression());

//Rate Limiting
// Login rate limiter (prevent brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit (500 requests per 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", loginLimiter);
app.use("/api", limiter);

//CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes(".vercel.app") ||
        origin.includes(".netlify.app")
      ) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error("CORS Not Allowed"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

//Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//Logger
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

//Auto Create Uploads Folder
const uploadDir = path.join(__dirname, "uploads");
const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory");
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("Created temp directory");
}

app.use("/uploads", express.static(uploadDir));

//Health & Root Routes
app.get("/", (req, res) => {
  res.send("ShoeVerse Premium Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    socketio: "active",
  });
});

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

//404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

//Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`ERROR [${statusCode}]:`, {
    message: err.message,
    stack: NODE_ENV === "development" ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    message: NODE_ENV === "development" ? err.message : "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

//Graceful Shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  httpServer.close(() => {
    console.log("HTTP server closed.");

    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  gracefulShutdown("Unhandled Rejection");
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("Uncaught Exception");
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

//Start Server
httpServer.listen(PORT, () => {
  console.log("ShoeVerse Server Started");
  console.log("Environment:", NODE_ENV);
  console.log("Port:", PORT);
  console.log("Socket.io: Enabled");
  console.log("Uploads:", uploadDir);
});
export { io };
