
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/imovies";

app.use(cors());
app.use(express.json());

if (!JWT_SECRET) {
  console.error("ERROR: JWT_SECRET missing in backend/.env");
  process.exit(1);
}

// -------------------- DATABASE MODELS --------------------

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieTitle: { type: String, required: true },
    date: { type: String, required: true },
    showtime: { type: String, required: true },
    seats: [{ type: String, required: true }],
    total: { type: Number, required: true },
    bookingCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

bookingSchema.index({
  movieTitle: 1,
  date: 1,
  showtime: 1,
});

const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// -------------------- MOVIES --------------------

const movies = [
  { id: 1, title: "Interstellar", category: "Sci-Fi", year: 2014, rating: "8.7", duration: "2h 49m", description: "A journey beyond the stars to save humanity." },
  { id: 2, title: "Inception", category: "Sci-Fi", year: 2010, rating: "8.8", duration: "2h 28m", description: "Enter the world where dreams become reality." },
  { id: 3, title: "The Dark Knight", category: "Action", year: 2008, rating: "9.0", duration: "2h 32m", description: "One hero. One city. One unforgettable battle." },
  { id: 4, title: "Dune: Part Two", category: "Sci-Fi", year: 2024, rating: "8.5", duration: "2h 46m", description: "The epic journey across the sands continues." },
  { id: 5, title: "Oppenheimer", category: "Drama", year: 2023, rating: "8.3", duration: "3h", description: "The story behind a world-changing discovery." },
  { id: 6, title: "Avengers: Endgame", category: "Action", year: 2019, rating: "8.4", duration: "3h 1m", description: "The heroes make their final stand." },
  { id: 7, title: "Spider-Man: No Way Home", category: "Action", year: 2021, rating: "8.2", duration: "2h 28m", description: "A familiar world turns upside down." },
  { id: 8, title: "The Batman", category: "Thriller", year: 2022, rating: "7.8", duration: "2h 56m", description: "Dark secrets are waiting in Gotham." },
  { id: 9, title: "Joker", category: "Drama", year: 2019, rating: "8.3", duration: "2h 2m", description: "A haunting story of a city and its chaos." },
  { id: 10, title: "Top Gun: Maverick", category: "Action", year: 2022, rating: "8.2", duration: "2h 10m", description: "Feel the speed. Experience the sky." },
  { id: 11, title: "Avatar: The Way of Water", category: "Adventure", year: 2022, rating: "7.5", duration: "3h 12m", description: "Discover the wonders of Pandora." },
  { id: 12, title: "Guardians of the Galaxy Vol. 3", category: "Adventure", year: 2023, rating: "7.9", duration: "2h 30m", description: "One last adventure for an unlikely family." },
  { id: 13, title: "John Wick: Chapter 4", category: "Action", year: 2023, rating: "7.6", duration: "2h 49m", description: "An action-packed fight for freedom." },
  { id: 14, title: "Mission: Impossible – Dead Reckoning", category: "Action", year: 2023, rating: "7.7", duration: "2h 43m", description: "A mission where every second counts." },
  { id: 15, title: "The Matrix", category: "Sci-Fi", year: 1999, rating: "8.7", duration: "2h 16m", description: "Question everything you think is real." },
  { id: 16, title: "Blade Runner 2049", category: "Sci-Fi", year: 2017, rating: "8.0", duration: "2h 44m", description: "A mystery hidden in a futuristic world." },
  { id: 17, title: "Ford v Ferrari", category: "Drama", year: 2019, rating: "8.1", duration: "2h 32m", description: "Engineering, racing and a legendary rivalry." },
  { id: 18, title: "La La Land", category: "Drama", year: 2016, rating: "8.0", duration: "2h 8m", description: "Dreams and music collide in Los Angeles." },
  { id: 19, title: "The Shawshank Redemption", category: "Drama", year: 1994, rating: "9.3", duration: "2h 22m", description: "A powerful story about hope and friendship." },
  { id: 20, title: "Jurassic Park", category: "Adventure", year: 1993, rating: "8.2", duration: "2h 7m", description: "An extraordinary park takes a wild turn." },
  { id: 21, title: "Doctor Strange", category: "Adventure", year: 2016, rating: "7.5", duration: "1h 55m", description: "Explore a world beyond ordinary reality." },
  { id: 22, title: "Black Panther", category: "Action", year: 2018, rating: "7.3", duration: "2h 14m", description: "A kingdom rises to meet its destiny." },
  { id: 23, title: "Tenet", category: "Sci-Fi", year: 2020, rating: "7.3", duration: "2h 30m", description: "Time is the key to the mission." },
];

const SHOWTIMES = [
  "10:00 AM",
  "01:30 PM",
  "04:30 PM",
  "06:30 PM",
  "09:30 PM",
];

// -------------------- HELPERS --------------------

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString() },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      message: "Please log in first.",
    });
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      message: "Session expired. Please log in again.",
    });
  }
}

function handleError(res, error) {
  console.error("API ERROR:", error);

  if (error?.code === 11000) {
    return res.status(409).json({
      message: "A duplicate value already exists.",
    });
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: error?.message || "Something went wrong.",
  });
}

function isValidBookingInput({ movieTitle, date, showtime, seats }) {
  return (
    typeof movieTitle === "string" &&
    movies.some((movie) => movie.title === movieTitle) &&
    typeof date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    typeof showtime === "string" &&
    SHOWTIMES.includes(showtime) &&
    Array.isArray(seats) &&
    seats.length >= 1 &&
    seats.length <= 24 &&
    seats.every(
      (seat) =>
        typeof seat === "string" &&
        /^[A-D][1-6]$/.test(seat)
    ) &&
    new Set(seats).size === seats.length
  );
}

// -------------------- BASIC ROUTES --------------------

app.get("/", (req, res) => {
  res.json({
    message: "IMovies API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    database: mongoose.connection.name,
    databaseState: mongoose.connection.readyState,
    bookingsCollection: Booking.collection.name,
  });
});

app.get("/api/movies", (req, res) => {
  res.json(movies);
});

// -------------------- AUTH ROUTES --------------------

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Enter your name, email and a password of at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        message: "Email already registered. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    return res.json({
      message: "Login successful.",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// -------------------- SEAT AVAILABILITY --------------------

app.get("/api/bookings/seats", async (req, res) => {
  try {
    const { movieTitle, date, showtime } = req.query;

    if (
      typeof movieTitle !== "string" ||
      typeof date !== "string" ||
      typeof showtime !== "string"
    ) {
      return res.status(400).json({
        message: "Movie, date and showtime are required.",
      });
    }

    const bookings = await Booking.find({
      movieTitle,
      date,
      showtime,
    }).select("seats");

    const bookedSeats = [
      ...new Set(bookings.flatMap((booking) => booking.seats)),
    ];

    return res.json({ bookedSeats });
  } catch (error) {
    return handleError(res, error);
  }
});

// -------------------- CREATE BOOKING --------------------

app.post("/api/bookings", authMiddleware, async (req, res) => {
  console.log("BOOKING REQUEST RECEIVED:", req.body);

  try {
    console.log("DATABASE NAME:", mongoose.connection.name);
    console.log("DATABASE STATE:", mongoose.connection.readyState);
    console.log("COLLECTION NAME:", Booking.collection.name);
    console.log("USER ID:", req.auth.userId);

    const { movieTitle, date, showtime, seats } = req.body;

    if (!isValidBookingInput({ movieTitle, date, showtime, seats })) {
      return res.status(400).json({
        message: "Please select a valid movie, showtime and seats.",
      });
    }

    const total = seats.length * 250;

    console.log("CHECKING SEAT CONFLICT...");

    const conflict = await Booking.findOne({
      movieTitle,
      date,
      showtime,
      seats: { $in: seats },
    });

    if (conflict) {
      return res.status(409).json({
        message:
          "One or more seats were just booked. Refresh seats and try again.",
      });
    }

    const bookingCode =
      "IM-" +
      randomBytes(4).toString("hex").toUpperCase();

    console.log("BEFORE BOOKING SAVE");

    const booking = await Booking.create({
      userId: req.auth.userId,
      movieTitle,
      date,
      showtime,
      seats,
      total,
      bookingCode,
    });

    console.log("AFTER BOOKING SAVE:", booking.toObject());
    console.log("SAVED BOOKING ID:", booking._id);

    // Read the document back from MongoDB for verification.
    const savedBooking = await Booking.findById(booking._id).lean();

    if (!savedBooking) {
      console.error("VERIFY FAILED: Booking not found after create.");

      return res.status(500).json({
        message: "Booking could not be verified in the database.",
      });
    }

    console.log("DATABASE VERIFICATION SUCCESS:", savedBooking._id);

    return res.status(201).json({
      message: "Booking confirmed and saved to MongoDB.",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("BOOKING SAVE FAILED:", error);
    return handleError(res, error);
  }
});

// -------------------- BOOKING HISTORY --------------------

app.get("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.auth.userId,
    }).sort({ createdAt: -1 });

    console.log(
      "BOOKING HISTORY REQUEST:",
      req.auth.userId,
      "COUNT:",
      bookings.length
    );

    return res.json({ bookings });
  } catch (error) {
    return handleError(res, error);
  }
});

// -------------------- CANCEL BOOKING --------------------

app.delete("/api/bookings/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found or you do not have permission to cancel it.",
      });
    }

    console.log("BOOKING CANCELLED:", booking._id);

    return res.json({
      message: "Booking cancelled successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// -------------------- START SERVER --------------------

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully!");
    console.log("CONNECTED DATABASE:", mongoose.connection.name);
    console.log("MONGODB HOST:", mongoose.connection.host);
    console.log("BOOKINGS COLLECTION:", Booking.collection.name);

    app.listen(PORT, () => {
      console.log(`IMovies server running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
