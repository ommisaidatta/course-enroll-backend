require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const enrollRoutes = require("./routes/enrollRoutes");
const profileRoutes = require("./routes/profileRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");
const reviewRoutes = require("./routes/ratingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
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

app.get("/", (req, res) => {
  res.send("Form API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
