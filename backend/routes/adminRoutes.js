import express from "express";
import { 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  updateUser,
  getUserDetails,
  toggleUserBlock,
  getUserActivity,
  exportUsers,
  getRevenueSummary,
  getRevenueByRange,
  getRevenueByProduct,
  getRevenueByCategory,
  getRevenueForecast,
  getRealtimeRevenue,
  getRevenueByPaymentMethod,
  
  //Import order controller functions
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  bulkUpdateOrders
} from "../controllers/adminController.js";

//Import product controller functions
import { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getLowStockProducts,
  getOutOfStockProducts,
  bulkDeleteProducts,
  updateStock,
  exportProducts
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//Dashboard & User Management Routes
router.get("/dashboard-stats", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserDetails);
router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);
router.patch("/users/:id/toggle-block", protect, admin, toggleUserBlock);
router.get("/users/:id/activity", protect, admin, getUserActivity);
router.get("/users/export/csv", protect, admin, exportUsers);

// Revenue Analytics Routes
router.get("/revenue/summary", protect, admin, getRevenueSummary);
router.get("/revenue/range", protect, admin, getRevenueByRange);
router.get("/revenue/products", protect, admin, getRevenueByProduct);
router.get("/revenue/categories", protect, admin, getRevenueByCategory);
router.get("/revenue/payment-methods", protect, admin, getRevenueByPaymentMethod);
router.get("/revenue/forecast", protect, admin, getRevenueForecast);
router.get("/revenue/realtime", protect, admin, getRealtimeRevenue);

// Product Management Routes
router.route("/products")
  .get(protect, admin, getProducts)
  .post(protect, admin, createProduct);

router.route("/products/:id")
  .get(protect, admin, getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.patch("/products/:id/toggle", protect, admin, toggleProductStatus);
router.get("/products/low-stock", protect, admin, getLowStockProducts);
router.get("/products/out-of-stock", protect, admin, getOutOfStockProducts);
router.post("/products/bulk-delete", protect, admin, bulkDeleteProducts);
router.patch("/products/:id/stock", protect, admin, updateStock);
router.get("/products/export", protect, admin, exportProducts);

// Order Management Routes
router.get("/orders", protect, admin, getAllOrders);
router.get("/orders/stats", protect, admin, getOrderStats);
router.get("/orders/:id", protect, admin, getOrderDetails);
router.put("/orders/:id/status", protect, admin, updateOrderStatus);
router.delete("/orders/:id", protect, admin, deleteOrder);
router.patch("/orders/bulk-update", protect, admin, bulkUpdateOrders);

export default router;