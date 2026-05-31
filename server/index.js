import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Import Routers
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import projectsRouter from "./routes/projects.js";
import skillsRouter from "./routes/skills.js";
import portfolioRouter from "./routes/portfolio.js";
import uploadRouter from "./routes/upload.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Connect Database ──────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting — protects against brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ── Static Files ──────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "../client/dist")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/upload", uploadRouter);
app.use("/u", portfolioRouter);

// ── Custom Domain Mapping ────────────────────────────────────────────────────
app.use("/api/portfolio", async (req, res, next) => {
  // Let this pass through to its own sub-routing
  next();
});

// ── Vanity URLs & Frontend SPA Fallback ──────────────────────────────────────
app.get("/:username", async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase();

    // Skip API, uploads, and assets
    if (
      username.startsWith("api") ||
      username.startsWith("uploads") ||
      username.includes(".")
    ) {
      return next();
    }

    // Look up the user by username
    const User = (await import("./models/User.js")).default;
    const user = await User.findOne({ username });

    if (!user) {
      return res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
        if (err) {
          return res.status(404).json({ error: "User not found" });
        }
      });
    }

    if (!user.isPublic) {
      return res.status(403).json({ error: "This portfolio is private" });
    }

    res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
      if (err) {
        // Fallback for development: redirect to Vite dev server's standard client route
        res.redirect(`http://localhost:5173/u/${user.username}`);
      }
    });
  } catch (error) {
    next(error);
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});