import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET PROFILE
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user.profile);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// UPDATE PROFILE
router.put("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name !== undefined) user.profile.name = req.body.name;
    if (req.body.title !== undefined) user.profile.title = req.body.title;
    if (req.body.bio !== undefined) user.profile.bio = req.body.bio;
    if (req.body.location !== undefined) user.profile.location = req.body.location;
    if (req.body.resumeUrl !== undefined) user.profile.resumeUrl = req.body.resumeUrl;
    if (req.body.avatar !== undefined) user.profile.avatar = req.body.avatar;
    if (req.body.socialLinks !== undefined) {
      user.profile.socialLinks = {
        ...user.profile.socialLinks,
        ...req.body.socialLinks
      };
    }

    await user.save();

    res.json({
      message: "Profile updated",
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// UPDATE CONFIG (templateId, isPublic, customDomain, contactEmail, plan)
router.put("/config", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { templateId, isPublic, customDomain, contactEmail, plan } = req.body;

    if (templateId !== undefined) user.templateId = templateId;
    if (isPublic !== undefined) user.isPublic = isPublic;
    if (contactEmail !== undefined) user.contactEmail = contactEmail;
    
    // Only allow updating customDomain if user is pro (or we allow it, but validate)
    if (customDomain !== undefined) {
      if (user.plan === "pro" || plan === "pro") {
        user.customDomain = customDomain.trim() ? customDomain.toLowerCase() : undefined;
      } else if (customDomain.trim()) {
        return res.status(400).json({ error: "Custom domains are a Pro feature. Please upgrade first." });
      }
    }

    if (plan !== undefined) {
      user.plan = plan;
    }

    await user.save();

    res.json({
      message: "Configuration updated",
      templateId: user.templateId,
      isPublic: user.isPublic,
      customDomain: user.customDomain,
      contactEmail: user.contactEmail,
      plan: user.plan,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;