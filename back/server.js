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

// ==================== SCHEMAS & MODELS ====================

// User სქემა
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

// Booking სქემა (ინახება 'bookings' კოლექციაში)
const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    matchId: { type: String, required: true },
    matchTitle: { type: String, required: true },
    seats: [
      {
        sector: String,
        row: Number,
        seat: Number,
        price: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema, "bookings");

// ==================== AUTH MIDDLEWARE ====================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "დაჯავშნისთვის გთხოვთ გაიაროთ ავტორიზაცია" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "torpedo_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "სესიის ვადა ამოიწურა, გთხოვთ ხელახლა შეხვიდეთ" });
    }
    req.user = user;
    next();
  });
};

// ==================== 1. SIGNUP ROUTE ====================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "გთხოვთ შეავსოთ ყველა ველი" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "ეს ელფოსტა უკვე დარეგისტრირებულია" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "მომხმარებელი ამ ელფოსტით ვერ მოიძებნა" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "არასწორი პაროლი" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "torpedo_secret_key",
      { expiresIn: "7d" }
    );

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

// ==================== 3. BOOKING ROUTE ====================
app.post("/api/bookings", verifyToken, async (req, res) => {
  try {
    const { matchId, matchTitle, seats, totalPrice } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "გთხოვთ აირჩიოთ სულ მცირე 1 ადგილი" });
    }

    const newBooking = new Booking({
      userId: req.user.userId,
      userEmail: req.user.email,
      matchId: matchId || "torpedo-match",
      matchTitle: matchTitle || "FC Torpedo Match",
      seats,
      totalPrice,
    });

    await newBooking.save();

    res.status(201).json({
      message: "ბილეთები წარმატებით დაიჯავშნა!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "სერვერის შეცდომა დაჯავშნისას" });
  }
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});