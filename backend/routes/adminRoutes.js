import express from "express";
import { 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  updateUser 
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getAllUsers);        // Get all users
router.delete("/users/:id", protect, admin, deleteUser);  // Delete user
router.put("/users/:id", protect, admin, updateUser);     // Update user

export default router;