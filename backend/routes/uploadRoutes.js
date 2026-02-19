import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { protect, admin } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/* ===============================
   ✅ BASE URL (Render + Local)
================================= */
const BASE_URL =
  process.env.BASE_URL || "http://localhost:5000";

/* ===============================
   ✅ Upload Folder Setup
================================= */
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   ✅ Multer Storage
================================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, "image-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

/* ===============================
   ✅ Upload Single Image
================================= */
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Upload successful",
    file: {
      url: `${BASE_URL}/uploads/${req.file.filename}`,
      alt: req.file.originalname,
      isPrimary: true,
    },
  });
});

/* ===============================
   ✅ Upload Multiple Images
================================= */
router.post(
  "/multiple",
  protect,
  admin,
  upload.array("images", 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file, index) => ({
      url: `${BASE_URL}/uploads/${file.filename}`,
      alt: file.originalname,
      isPrimary: index === 0,
    }));

    res.json({
      message: "Upload successful",
      files,
    });
  }
);

/* ===============================
   ✅ Delete Image
================================= */
router.delete("/:filename", protect, admin, (req, res) => {
  const filepath = path.join(uploadDir, req.params.filename);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

export default router;
