import express from "express";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// @desc    Get user's public portfolio data by custom domain
// @route   GET /u/by-domain/resolve
// @access  Public
router.get("/by-domain/resolve", async (req, res) => {
  try {
    const { domain } = req.query;
    if (!domain) {
      return res.status(400).json({ error: "Domain parameter is required" });
    }

    const user = await User.findOne({ customDomain: domain.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "No portfolio found bound to this custom domain." });
    }

    if (!user.isPublic) {
      return res.status(403).json({ error: "This portfolio is private" });
    }

    res.json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get user's public portfolio data by username
// @route   GET /u/:username
// @access  Public
router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isPublic) {
      return res.status(403).json({ error: "This portfolio is private" });
    }

    // Return public portfolio JSON
    res.json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Send contact form email to developer
// @route   POST /u/:username/contact
// @access  Public
router.post("/:username/contact", async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Recipient user not found" });
    }

    const recipient = user.contactEmail || user.email;

    const textContent = `Hello ${user.profile?.name || user.username},

You have received a new contact message on your CodeFolio website.

Sender Details:
- Name: ${name}
- Email: ${email}

Message:
------------------------------------------
${message}
------------------------------------------

Best regards,
The CodeFolio Automator`;

    const htmlContent = `<div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4f46e5;">New CodeFolio Message</h2>
      <p>Hello <strong>${user.profile?.name || user.username}</strong>,</p>
      <p>You have received a new message via your portfolio site.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p><strong>Sender Name:</strong> ${name}</p>
      <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; font-style: italic;">
        ${message.replace(/\n/g, "<br/>")}
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #6b7280;">Sent via CodeFolio Platform</p>
    </div>`;

    await sendEmail({
      to: recipient,
      replyTo: email,
      subject: `CodeFolio: New message from ${name}`,
      text: textContent,
      html: htmlContent,
    });

    res.json({ message: "Your message has been delivered to the developer!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

