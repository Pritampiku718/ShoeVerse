import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  changePassword,
  deleteUserAccount,
} from "../controllers/authController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Public routes with rate limiting
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

// Profile routes (Protected)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

// Password change route (Protected)
router.put("/change-password", protect, changePassword);

// Admin Route: Get All Users (Protected + Admin only)
router.get("/users", protect, admin, getAllUsers);

export default router;