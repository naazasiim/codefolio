/**
 * Demo seeder — creates 3 showcase accounts for evaluators:
 *   /u/demo1  → Minimalist template (Alex Rivera)
 *   /u/demo2  → Cyberpunk template  (Naaz Asim)
 *   /u/demo3  → Corporate template  (Jordan Lee)
 *
 * Usage:  node server/seed.js
 */

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import User from "./models/User.js";

const MONGO_URI = process.env.MONGO_URI;

const demoUsers = [
  {
    email: "demo1@codefolio.dev",
    password: "Demo@12345",
    username: "demo1",
    templateId: "minimalist",
    plan: "free",
    isPublic: true,
    contactEmail: "demo1@codefolio.dev",
    profile: {
      name: "Alex Rivera",
      title: "Full Stack Developer",
      bio: "I build things for the web. Passionate about clean architecture, open source, and developer tooling. Currently working on distributed systems and cloud-native applications.\n\nWhen not coding, I'm hiking trails or contributing to OSS projects.",
      location: "San Francisco, CA",
      resumeUrl: "https://drive.google.com",
      socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    projects: [
      {
        title: "CloudOps Dashboard",
        description: "A real-time infrastructure monitoring dashboard that aggregates metrics from AWS, GCP, and Azure. Features custom alerting, cost analysis, and team collaboration tools.",
        techStack: ["React", "Node.js", "GraphQL", "PostgreSQL", "Docker"],
        repoLink: "https://github.com",
        liveLink: "https://vercel.app",
      },
      {
        title: "OpenAPI Spec Generator",
        description: "CLI tool that automatically generates OpenAPI 3.0 specs from Express.js route annotations. Outputs Swagger-compatible JSON and Markdown docs.",
        techStack: ["Node.js", "TypeScript", "AST Parsing", "Swagger"],
        repoLink: "https://github.com",
        liveLink: null,
      },
      {
        title: "Micro Blog Engine",
        description: "A lightweight blogging platform built with Astro and MDX. Supports syntax highlighting, dark mode, RSS feeds, and zero-JS article pages.",
        techStack: ["Astro", "MDX", "TailwindCSS", "Vercel"],
        repoLink: "https://github.com",
        liveLink: "https://astro.build",
      },
    ],
    skills: [
      { name: "React", category: "Frontend", level: "Expert" },
      { name: "TypeScript", category: "Frontend", level: "Advanced" },
      { name: "Node.js", category: "Backend", level: "Expert" },
      { name: "PostgreSQL", category: "Backend", level: "Advanced" },
      { name: "Docker", category: "DevOps", level: "Intermediate" },
      { name: "AWS", category: "DevOps", level: "Intermediate" },
    ],
  },
  {
    email: "demo2@codefolio.dev",
    password: "Demo@12345",
    username: "demo2",
    templateId: "cyberpunk",
    plan: "pro",
    isPublic: true,
    contactEmail: "demo2@codefolio.dev",
    profile: {
      name: "Naaz Asim",
      title: "Security Engineer & Hacker",
      bio: "Netrunner by night, systems hacker by day. I specialize in red-team operations, exploit development, and building hardened distributed systems.\n\nCVEs found: 3 | Bug bounties: $12k+ | Coffee consumed: ∞",
      location: "Mumbai, IN",
      resumeUrl: "https://drive.google.com",
      socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    projects: [
      {
        title: "GHOSTNET",
        description: "A covert network scanning and OSINT aggregation tool. Identifies exposed services, runs passive recon, and generates threat maps. Used in ethical hacking engagements.",
        techStack: ["Python", "Scapy", "Shodan API", "SQLite", "Click CLI"],
        repoLink: "https://github.com",
        liveLink: null,
      },
      {
        title: "VAULT_ACCESS",
        description: "Zero-trust secrets management microservice with hardware-backed key storage, time-limited access tokens, and full audit trails. Inspired by HashiCorp Vault.",
        techStack: ["Go", "gRPC", "Redis", "HSM", "Kubernetes"],
        repoLink: "https://github.com",
        liveLink: "https://go.dev",
      },
      {
        title: "CipherChat",
        description: "End-to-end encrypted messaging app using the Signal Protocol. Features disappearing messages, screenshot detection, and device verification.",
        techStack: ["React Native", "Rust", "Signal Protocol", "SQLCipher"],
        repoLink: "https://github.com",
        liveLink: null,
      },
    ],
    skills: [
      { name: "Penetration Testing", category: "Other", level: "Expert" },
      { name: "Go", category: "Backend", level: "Advanced" },
      { name: "Python", category: "Backend", level: "Expert" },
      { name: "Rust", category: "Backend", level: "Intermediate" },
      { name: "Kubernetes", category: "DevOps", level: "Advanced" },
      { name: "Cryptography", category: "Other", level: "Advanced" },
    ],
  },
  {
    email: "demo3@codefolio.dev",
    password: "Demo@12345",
    username: "demo3",
    templateId: "corporate",
    plan: "pro",
    isPublic: true,
    contactEmail: "demo3@codefolio.dev",
    profile: {
      name: "Jordan Lee",
      title: "Engineering Manager & Architect",
      bio: "10+ years designing scalable distributed systems at Fortune 500 companies. I lead high-impact engineering teams, drive technical strategy, and mentor senior engineers.\n\nCurrently focused on AI-augmented developer workflows and platform engineering.",
      location: "New York, NY",
      resumeUrl: "https://drive.google.com",
      socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    projects: [
      {
        title: "Enterprise API Gateway",
        description: "Designed and delivered a unified API gateway serving 500M+ daily requests. Implemented dynamic rate limiting, circuit breakers, and multi-region failover with zero-downtime deployments.",
        techStack: ["Java", "Spring Boot", "Kafka", "Istio", "Terraform"],
        repoLink: "https://github.com",
        liveLink: "https://spring.io",
      },
      {
        title: "AI Code Review Platform",
        description: "An LLM-powered code review assistant that detects security vulnerabilities, suggests refactors, and enforces team conventions — integrated into GitHub and GitLab CI pipelines.",
        techStack: ["Python", "FastAPI", "GPT-4", "Redis", "PostgreSQL"],
        repoLink: "https://github.com",
        liveLink: "https://fastapi.tiangolo.com",
      },
    ],
    skills: [
      { name: "System Design", category: "Other", level: "Expert" },
      { name: "Java / Spring", category: "Backend", level: "Expert" },
      { name: "Python", category: "Backend", level: "Advanced" },
      { name: "React", category: "Frontend", level: "Intermediate" },
      { name: "Terraform", category: "DevOps", level: "Advanced" },
      { name: "Kafka", category: "Backend", level: "Expert" },
      { name: "Figma", category: "Design", level: "Beginner" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let created = 0;
    let skipped = 0;

    for (const demo of demoUsers) {
      const exists = await User.findOne({ username: demo.username });
      if (exists) {
        console.log(`⚠️  Skipping @${demo.username} — already exists`);
        skipped++;
        continue;
      }

      const { projects, skills, ...userData } = demo;
      const user = await User.create(userData);

      // Add projects
      for (const proj of projects) {
        user.projects.push(proj);
      }

      // Add skills
      for (const sk of skills) {
        user.skills.push(sk);
      }

      await user.save();
      console.log(`✅ Created demo account: @${demo.username} (${demo.templateId} template)`);
      created++;
    }

    console.log(`\n🎉 Seeding complete: ${created} created, ${skipped} skipped.`);
    console.log(`\n📎 Demo portfolio URLs:`);
    console.log(`   http://localhost:5173/u/demo1  →  Minimalist (Alex Rivera)`);
    console.log(`   http://localhost:5173/u/demo2  →  Cyberpunk  (Naaz Asim)`);
    console.log(`   http://localhost:5173/u/demo3  →  Corporate  (Jordan Lee)`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
