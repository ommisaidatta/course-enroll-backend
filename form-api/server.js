require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const enrollRoutes = require("./routes/enrollRoutes");
const profileRoutes = require("./routes/profileRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");
const reviewRoutes = require("./routes/ratingRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Connect to MongoDB
connectDB();

if (!fs.existsSync("certificates")) {
  fs.mkdirSync("certificates");
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// API routes
app.use("/api/students", studentRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enroll", enrollRoutes);
app.use("/api", profileRoutes);
app.use("/api/lesson", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/rating", reviewRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/certificates", express.static("certificates"));

app.get("/", (req, res) => {
  res.send("Form API is running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
