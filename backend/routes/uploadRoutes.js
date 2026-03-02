import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//CLOUDINARY CONFIGURATION
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//CLOUDINARY STORAGE SETUP
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "shoeverse/products",
      format: file.mimetype.split("/")[1] || "jpg",
      public_id: `product-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      transformation: [
        {
          width: 1000,
          height: 1000,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    };
  },
});

//MULTER CONFIGURATION
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    
    //Allow all image types
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Only ${allowedMimes.join(", ")} are allowed`,
        ),
        false,
      );
    }
  },
});


//TEST ROUTE - Checking for upload route is working
//GET /api/upload/test
router.get("/test", (req, res) => {
  res.json({
    message: "Upload route is working",
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing",
  });
});

//SINGLE IMAGE UPLOAD
//POST /api/upload
router.post(
  "/",
  protect,
  admin,
  (req, res, next) => {
    console.log("Upload request received");
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);

    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      console.log("Multer processed, req.file:", req.file);
      next();
    });
  },
  async (req, res) => {
    try {
      console.log("In final handler, req.file:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded or file is invalid",
        });
      }

      console.log("File uploaded successfully:", {
        path: req.file.path,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      res.json({
        success: true,
        message: "Upload successful",
        file: {
          url: req.file.path,
          publicId: req.file.filename,
          alt: req.file.originalname,
        },
      });
    } catch (error) {
      console.error("Single upload error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Image upload failed",
      });
    }
  },
);

//MULTIPLE IMAGE UPLOAD
//POST /api/upload/multiple
router.post(
  "/multiple",
  protect,
  admin,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      console.log(`${req.files.length} files uploaded successfully`);

      const files = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        alt: file.originalname,
        isPrimary: index === 0,
      }));

      res.json({
        success: true,
        message: "Upload successful",
        data: files,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Multiple image upload failed",
      });
    }
  },
);

//DELETE IMAGE FROM CLOUDINARY
//DELETE /api/upload/:publicId
router.delete("/:publicId", protect, admin, async (req, res) => {
  try {
    const publicId = req.params.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "No image ID provided",
      });
    }

    console.log("Deleting image:", publicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else if (result.result === "not found") {
      res.status(404).json({
        success: false,
        message: "Image not found in Cloudinary",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to delete image",
      });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete image",
    });
  }
});

export default router;
