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
  getRevenueByPaymentMethod
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// User Management Routes
// ============================================
router.get("/dashboard-stats", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserDetails);
router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);
router.patch("/users/:id/toggle-block", protect, admin, toggleUserBlock);
router.get("/users/:id/activity", protect, admin, getUserActivity);
router.get("/users/export/csv", protect, admin, exportUsers);

// ============================================
// Revenue Analytics Routes
// ============================================
/**
 * @route   GET /api/admin/revenue/summary
 * @desc    Get revenue summary (total, daily, monthly, quarterly)
 * @access  Private/Admin
 */
router.get("/revenue/summary", protect, admin, getRevenueSummary);

/**
 * @route   GET /api/admin/revenue/range
 * @desc    Get revenue for specific date range
 * @access  Private/Admin
 */
router.get("/revenue/range", protect, admin, getRevenueByRange);

/**
 * @route   GET /api/admin/revenue/products
 * @desc    Get revenue by product
 * @access  Private/Admin
 */
router.get("/revenue/products", protect, admin, getRevenueByProduct);

/**
 * @route   GET /api/admin/revenue/categories
 * @desc    Get revenue by category
 * @access  Private/Admin
 */
router.get("/revenue/categories", protect, admin, getRevenueByCategory);

/**
 * @route   GET /api/admin/revenue/payment-methods
 * @desc    Get revenue by payment method
 * @access  Private/Admin
 */
router.get("/revenue/payment-methods", protect, admin, getRevenueByPaymentMethod);

/**
 * @route   GET /api/admin/revenue/forecast
 * @desc    Get revenue forecast
 * @access  Private/Admin
 */
router.get("/revenue/forecast", protect, admin, getRevenueForecast);

/**
 * @route   GET /api/admin/revenue/realtime
 * @desc    Get real-time revenue updates
 * @access  Private/Admin
 */
router.get("/revenue/realtime", protect, admin, getRealtimeRevenue);

// ============================================
// Order Management Routes (Optional - Add if needed)
// ============================================
// router.get("/orders", protect, admin, getAllOrders);
// router.get("/orders/:id", protect, admin, getOrderDetails);
// router.put("/orders/:id/status", protect, admin, updateOrderStatus);
// router.get("/orders/stats", protect, admin, getOrderStats);

// ============================================
// Product Management Routes (Optional - Add if needed)
// ============================================
// router.get("/products/low-stock", protect, admin, getLowStockProducts);
// router.get("/products/out-of-stock", protect, admin, getOutOfStockProducts);
// router.post("/products/bulk-delete", protect, admin, bulkDeleteProducts);
// router.get("/products/export", protect, admin, exportProducts);

export default router;