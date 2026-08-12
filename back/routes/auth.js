import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "სახელი, ელფოსტა და პაროლი სავალდებულოა" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "ამ ელფოსტით მომხმარებელი უკვე არსებობს" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

    const token = signToken(user._id);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "სერვერის შეცდომა, სცადეთ მოგვიანებით" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "ელფოსტა და პაროლი სავალდებულოა" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "ელფოსტა ან პაროლი არასწორია" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "ელფოსტა ან პაროლი არასწორია" });
    }

    const token = signToken(user._id);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "სერვერის შეცდომა, სცადეთ მოგვიანებით" });
  }
});

// GET /api/auth/me  (მოითხოვს Authorization: Bearer <token>)
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
  res.json({ user: toPublicUser(user) });
});

export default router;