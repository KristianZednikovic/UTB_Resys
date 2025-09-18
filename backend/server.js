const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API Routes
app.get("/api", (req, res) => {
  res.json({
    message: "UTB Reservation System API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// In-memory storage for reservations (in production, use a database)
let reservations = [
  {
    id: 1,
    teamName: "Tým Strašidel",
    participantCount: 4,
    email: "test@example.com",
    time: "15:30",
    timeDisplay: "15:30 - 15:40",
    date: "2024-10-31",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    teamName: "Halloween Heroes",
    participantCount: 6,
    email: "test@example.com",
    time: "17:20",
    timeDisplay: "17:20 - 17:30",
    date: "2024-10-31",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

// Get reservations by email
app.get("/api/reservations", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      error: "Email parameter is required",
    });
  }

  const userReservations = reservations.filter(
    (reservation) => reservation.email === email
  );

  res.json({
    reservations: userReservations,
    count: userReservations.length,
  });
});

// Create a new reservation
app.post("/api/reservations", (req, res) => {
  const { teamName, participantCount, email, time } = req.body;

  // Validate required fields
  if (!teamName || !participantCount || !email || !time) {
    return res.status(400).json({
      error: "Missing required fields: teamName, participantCount, email, time",
    });
  }

  // Generate time display
  const timeDisplay = `${time} - ${time.slice(0, 2)}:${String(
    parseInt(time.slice(3)) + 10
  ).padStart(2, "0")}`;

  const newReservation = {
    id: reservations.length + 1,
    teamName,
    participantCount: parseInt(participantCount),
    email,
    time,
    timeDisplay,
    date: "2024-10-31", // Fixed date for the event
    status: "active",
    createdAt: new Date().toISOString(),
  };

  reservations.push(newReservation);

  res.status(201).json({
    message: "Reservation created successfully",
    reservation: newReservation,
  });
});

// Cancel a reservation
app.put("/api/reservations/:id/cancel", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required to cancel reservation",
    });
  }

  const reservation = reservations.find(
    (res) => res.id === parseInt(id) && res.email === email
  );

  if (!reservation) {
    return res.status(404).json({
      error: "Reservation not found or you don't have permission to cancel it",
    });
  }

  if (reservation.status === "cancelled") {
    return res.status(400).json({
      error: "Reservation is already cancelled",
    });
  }

  reservation.status = "cancelled";
  reservation.cancelledAt = new Date().toISOString();

  res.json({
    message: "Reservation cancelled successfully",
    reservation,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
