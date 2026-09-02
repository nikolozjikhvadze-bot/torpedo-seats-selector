const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB კავშირი
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully to Auth database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User სქემა და მოდელი (ინახება auth ბაზაში/users კოლექციაში)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

// ==================== 1. SIGNUP ROUTE ====================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "გთხოვთ შეავსოთ ყველა ველი" });
    }

    // შემოწმება: ხომ არ არსებობს უკვე ასეთი ელფოსტა
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "ეს ელფოსტა უკვე დარეგისტრირებულია" });
    }

    // პაროლის დაჰეშვა უსაფრთხოებისთვის
    const hashedPassword = await bcrypt.hash(password, 10);

    // ახალი მომხმარებლის შექმნა
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "რეგისტრაცია წარმატებით დასრულდა!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "სერვერის შეცდომა რეგისტრაციისას" });
  }
});

// ==================== 2. LOGIN ROUTE ====================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "გთხოვთ შეიყვანოთ ელფოსტა და პაროლი" });
    }

    // მომხმარებლის მოძებნა ბაზაში
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "მომხმარებელი ამ ელფოსტით ვერ მოიძებნა" });
    }

    // პაროლის შემოწმება
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "არასწორი პაროლი" });
    }

    // JWT ტოკენის გენერაცია
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "torpedo_secret_key",
      { expiresIn: "7d" }
    );

    // ვაბრუნებთ ტოკენს და მომხმარებლის მონაცემებს (პაროლის გარეშე)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "სერვერის შეცდომა ავტორიზაციისას" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});