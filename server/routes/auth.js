import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import nodemailer from 'nodemailer';

// ── 💡 SAHI PATH LOCK KAREIN ──
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// '../.env' ka matlab hai: routes folder se 1 step bahar niklo (server folder mein) aur wahan ki .env uthao
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// ───────────────────────────────

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
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email address." });
    }

    // 1. Plain random token generate karein
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Token ko SHA256 se HASH karke database mein save karein (Dono side match ke liye)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
      
    // 3. Expiry time save karein (Abhi se 1 ghanta aage)
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    // 4. Link mein plain resetToken jayega
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // 5. Bypass Loader Credentials Setup
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS; 

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const emailOptions = {
      from: `"CodeFolio Security" <${emailUser}>`,
      to: user.email,
      subject: "Reset Your CodeFolio Password",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px; margin: 0 auto; border: 1px solid #e2e8f0;">
          <h2 style="color: #6366f1; margin-bottom: 8px; font-size: 22px;">Password Reset Request</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">Hello,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">Click the button below to safely configure a new password for your account:</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${resetUrl}" target="_blank" style="background-color: #6366f1; color: white; padding: 12px 28px; font-weight: 600; text-decoration: none; border-radius: 10px; display: inline-block;">
              Configure New Password
            </a>
          </div>
          <p style="font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            This link will expire automatically in 1 hour.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(emailOptions);
    return res.status(200).json({ message: "Password reset link has been dispatched to your inbox!" });

  } catch (error) {
    console.error("❌ NODEMAILER DETAILED EXCEPTION ERROR:", error.message);
    return res.status(500).json({ error: `Mail transmission failed: ${error.message}` });
  }
});

// ───────────────── RESET PASSWORD ─────────────────
router.post("/reset-password/:token", async (req, res) => {
  try {
    // 1. URL ke token ko hash karein taaki database match sake
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 2. MongoDB se sirf Token se find karein (Query level time boundary hata di hai)
    const user = await User.findOne({
      resetPasswordToken: hashedToken
    }).select("+password");

    // 3. User check
    if (!user) {
      return res.status(400).json({
        error: "Invalid token. Please request a new link.",
      });
    }

    // 4. Native JavaScript Date engine se foolproof expiry verification
    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        error: "Token has expired. Please request a new link.",
      });
    }

    // 5. Password update aur clean settings
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

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