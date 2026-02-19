import express from "express";
import multer from "multer";
import { v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ✅ CLOUDINARY CONFIGURATION
===================================================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =====================================================
   ✅ CLOUDINARY STORAGE SETUP
===================================================== */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    return {
      folder: "shoeverse-products",

      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],

      public_id: `shoe-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`,
    };
  },
});

/* =====================================================
   ✅ MULTER CONFIGURATION
===================================================== */
const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/* =====================================================
   ✅ SINGLE IMAGE UPLOAD
   POST /api/upload
===================================================== */
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      res.json({
        message: "Upload successful",

        file: {
          url: req.file.path, // ✅ Cloudinary URL
          publicId: req.file.public_id, // ✅ FIXED (Correct ID)
          alt: req.file.originalname,
          isPrimary: true,
        },
      });
    } catch (error) {
      console.error("Single upload error:", error);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);

/* =====================================================
   ✅ MULTIPLE IMAGE UPLOAD
   POST /api/upload/multiple
===================================================== */
router.post(
  "/multiple",
  protect,
  admin,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "No files uploaded",
        });
      }

      const files = req.files.map((file, index) => ({
        url: file.path, // ✅ Cloudinary URL
        publicId: file.public_id, // ✅ FIXED (Correct ID)
        alt: file.originalname,
        isPrimary: index === 0,
      }));

      res.json({
        message: "Upload successful",
        files,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);

      res.status(500).json({
        message: "Multiple image upload failed",
      });
    }
  }
);

/* =====================================================
   ✅ DELETE IMAGE FROM CLOUDINARY
   DELETE /api/upload/:publicId
===================================================== */
router.delete(
  "/:publicId",
  protect,
  admin,
  async (req, res) => {
    try {
      const publicId = req.params.publicId;

      if (!publicId) {
        return res.status(400).json({
          message: "No image id provided",
        });
      }

      // ✅ Delete from Cloudinary
      const result = await cloudinary.v2.uploader.destroy(publicId);

      if (result.result !== "ok") {
        return res.status(404).json({
          message: "Image not found in Cloudinary",
        });
      }

      res.json({
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Delete image error:", error);

      res.status(500).json({
        message: "Failed to delete image",
      });
    }
  }
);

export default router;
