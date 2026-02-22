import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   USER ROUTES
================================ */

// ✅ Place new order
router.post("/", protect, createOrder);

// ✅ Logged-in user orders
router.get("/myorders", protect, getMyOrders);

/* ================================
   ADMIN ROUTES (KEEP ABOVE :id)
================================ */

// ✅ Admin: Get all orders
router.get("/admin/all", protect, admin, getAllOrders);

// ✅ Admin: Update order status
router.put("/admin/:id/status", protect, admin, updateOrderStatus);

// ✅ Admin: Delete order
router.delete("/admin/:id", protect, admin, deleteOrder);

/* ================================
   ORDER DETAILS
================================ */

// ✅ Get single order by ID
router.get("/:id", protect, getOrderById);

export default router;