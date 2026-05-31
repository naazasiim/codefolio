import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ───────────────── REGISTER ─────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const user = await User.create({
      email,
      password,
      username,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ───────────────── LOGIN ─────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ───────────────── GET CURRENT USER ─────────────────
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// ───────────────── CHANGE PASSWORD ─────────────────
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ───────────────── FORGOT PASSWORD ─────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Normally email this link
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    res.json({
      message: "Password reset link generated",
      resetUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ───────────────── RESET PASSWORD ─────────────────
router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ───────────────── LOGOUT ─────────────────
router.post("/logout", protect, async (req, res) => {
  res.json({
    message: "Logout successful",
  });
});

export default router;