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
    const { email, password } = req.body;

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

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      success: true,
      token,
      student: {
        id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        phone: student.phone,
        address: student.address,
        gender: student.gender,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerStudent, loginStudent };
