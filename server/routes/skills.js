import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Add a skill to user profile
// @route   POST /api/skills
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, category, level } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Skill name is required" });
    }

    const user = await User.findById(req.user._id);

    const newSkill = {
      name,
      category: category || "Other",
      level: level || "Intermediate",
    };

    user.skills.push(newSkill);
    await user.save();

    res.status(201).json({
      message: "Skill added successfully",
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Update a skill in user profile
// @route   PUT /api/skills/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const user = await User.findById(req.user._id);

    const skill = user.skills.id(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (name !== undefined) skill.name = name;
    if (category !== undefined) skill.category = category;
    if (level !== undefined) skill.level = level;

    await user.save();

    res.json({
      message: "Skill updated successfully",
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Delete a skill from user profile
// @route   DELETE /api/skills/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const skill = user.skills.id(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    skill.deleteOne();
    await user.save();

    res.json({
      message: "Skill deleted successfully",
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
