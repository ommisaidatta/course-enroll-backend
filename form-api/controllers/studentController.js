const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "58221825fd2a7930b41a5783b42df07d969351d8041d14bbd0878c54b7be40a1da77b2debfaa5abfa6dd44001b709d89f281562ae488daf765dcaf1ca9834cb2";

const registerStudent = async (req, res) => {
  try {
    console.log("Full Details:", req.body);
    const { firstname, lastname, email, password, phone, address, gender } =
      req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      firstname,
      lastname,
      email,
      password: hashPassword,
      phone,
      address,
      gender,
    });

    console.log("Saving to MongoDB...");
    const savedStudent = await student.save();
    console.log("SAVED! ID:", savedStudent._id);

    return res.status(201).json({
      message: "Student registered successfully",
      id: savedStudent._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    console.error("FULL ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        id: student._id,
        email: student.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { id: student._id },
      process.env.JWT_REFRESH_SECRET,
      {
        // Always keep users logged in for up to 90 days,
        // actual logout is handled by clearing this cookie.
        expiresIn: "90d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // for production change to true
      sameSite: "strict",
      // Match the JWT expiry: 90 days in milliseconds
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      student,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ accessToken: newAccessToken });
  });
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

module.exports = { registerStudent, loginStudent, refreshAccessToken, logout };
