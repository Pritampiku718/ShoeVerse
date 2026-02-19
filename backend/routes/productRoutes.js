import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ========= PUBLIC ========= */
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

/* ========= ADMIN ========= */
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
