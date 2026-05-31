import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }], // ["React", "Node.js", "MongoDB"]
    repoLink: { type: String, trim: true },
    liveLink: { type: String, trim: true },
    screenshot: {
      url: String,      // Cloudinary URL
      publicId: String, // Cloudinary public_id (for deletion)
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // for drag-and-drop reordering
  },
  { timestamps: true }
);

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ["Frontend", "Backend", "DevOps", "Design", "Other"],
    default: "Other",
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Intermediate",
  },
});

const SocialLinksSchema = new mongoose.Schema({
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  twitter: { type: String, trim: true },
  website: { type: String, trim: true },
  instagram: { type: String, trim: true },
});

// ── Main User schema ──────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    // Auth
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },

    // Vanity URL slug — e.g. codefolio.com/naaz
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_-]{3,30}$/, "Username can only contain letters, numbers, underscores, and hyphens"],
    },

    // Profile
    profile: {
      name: { type: String, trim: true },
      title: { type: String, trim: true }, // "Full Stack Developer"
      bio: { type: String, trim: true, maxlength: 500 },
      avatar: {
        url: String,
        publicId: String,
      },
      location: { type: String, trim: true },
      resumeUrl: { type: String, trim: true },
      socialLinks: { type: SocialLinksSchema, default: () => ({}) },
    },

    // Projects array
    projects: [ProjectSchema],

    // Skills array
    skills: [SkillSchema],

    // Template engine — which design theme they chose
    templateId: {
      type: String,
      enum: ["minimalist", "cyberpunk", "corporate"],
      default: "minimalist",
    },

    // Premium / subscription
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    customDomain: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Contact form — we store user's real email server-side (never exposed to public)
    contactEmail: { type: String, trim: true },

    
    // SEO / meta
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ── Middleware: Hash password before save ─────────────────────────────────────

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Methods ───────────────────────────────────────────────────────────────────

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe public data (no password, no private email)
UserSchema.methods.toPublicJSON = function () {
  return {
    username: this.username,
    plan: this.plan,
    templateId: this.templateId,
    profile: this.profile,
    projects: this.projects,
    skills: this.skills,
    isPublic: this.isPublic,
  };
};

export default mongoose.model("User", UserSchema);