import express from "express";
import { upload, isCloudinaryConfigured } from "../config/cloudinary.js";

const router = express.Router();

// @desc    Upload an image (avatar or project screenshot)
// @route   POST /api/upload
// @access  Private (though can be protected if desired, let's protect it)
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    
    // Determine image URL
    // For Cloudinary, multer-storage-cloudinary populates path (or path / url / secure_url)
    // For Local, multer.diskStorage populates path as absolute, but filename is what we need to serve statically
    const url = isCloudinaryConfigured 
      ? (req.file.path || req.file.url) 
      : `${backendUrl}/uploads/${req.file.filename}`;

    const publicId = req.file.filename || req.file.public_id || req.file.filename;

    res.status(200).json({
      message: "Image uploaded successfully",
      url,
      publicId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
