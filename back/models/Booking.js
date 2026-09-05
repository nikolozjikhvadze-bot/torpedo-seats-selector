// ==================== BOOKING SCHEMA ====================
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

// ==================== CREATE BOOKING ROUTE ====================
app.post("/api/bookings", verifyToken, async (req, res) => {
  try {
    const { matchId, matchTitle, seats, totalPrice } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "გთხოვთ აირჩიოთ სულ მცირე 1 ადგილი" });
    }

    const newBooking = new Booking({
      userId: req.user.userId,
      userEmail: req.user.email,
      matchId: matchId || "torpedo-vs-dinamo",
      matchTitle: matchTitle || "FC Torpedo Kutaisi vs FC Dinamo Tbilisi",
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