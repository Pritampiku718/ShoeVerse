import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
console.log('📁 Loading environment variables...');
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if env vars are loaded
console.log('📊 Environment check:');
console.log(`   PORT: ${process.env.PORT || 'Not set (will use 5000)'}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Found' : '❌ Not found'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Found' : '❌ Not found'}`);

// Connect to MongoDB
connectDB();

const app = express();

// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

// Simple CORS - allow all origins for testing
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(uploadDir));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ShoeVerse API is running',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint is working!',
    env: {
      port: process.env.PORT,
      mongo_uri_set: !!process.env.MONGO_URI,
      node_env: process.env.NODE_ENV || 'development'
    }
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.url
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 SERVER STARTED SUCCESSFULLY`);
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test: http://localhost:${PORT}/api/test`);
  console.log(`📍 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📍 Products: http://localhost:${PORT}/api/products`);
  console.log(`📍 Uploads: ${uploadDir}`);
  console.log('='.repeat(50) + '\n');
});
