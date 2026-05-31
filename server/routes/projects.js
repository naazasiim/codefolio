import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Add a project to user profile
// @route   POST /api/projects
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, techStack, repoLink, liveLink, screenshot, featured, order } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Project title is required" });
    }

    const user = await User.findById(req.user._id);
    
    const newProject = {
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      repoLink,
      liveLink,
      screenshot,
      featured: !!featured,
      order: Number(order) || 0,
    };

    user.projects.push(newProject);
    await user.save();

    res.status(201).json({
      message: "Project added successfully",
      projects: user.projects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Update a project in user profile
// @route   PUT /api/projects/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, techStack, repoLink, liveLink, screenshot, featured, order } = req.body;
    const user = await User.findById(req.user._id);
    
    const project = user.projects.id(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (techStack !== undefined) project.techStack = Array.isArray(techStack) ? techStack : [];
    if (repoLink !== undefined) project.repoLink = repoLink;
    if (liveLink !== undefined) project.liveLink = liveLink;
    if (screenshot !== undefined) project.screenshot = screenshot;
    if (featured !== undefined) project.featured = !!featured;
    if (order !== undefined) project.order = Number(order) || 0;

    await user.save();

    res.json({
      message: "Project updated successfully",
      projects: user.projects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Delete a project from user profile
// @route   DELETE /api/projects/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Find project and remove it
    const project = user.projects.id(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.deleteOne();
    await user.save();

    res.json({
      message: "Project deleted successfully",
      projects: user.projects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
