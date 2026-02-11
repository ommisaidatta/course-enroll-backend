const User = require("../models/student");
const Enrollment = require("../models/enrollment");
const bcrypt = require("bcryptjs");

// Get My Profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollments = await Enrollment.find({
      user: userId,
    });

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
      totalEnrollments: enrollments.length,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Update Profile
exports.updateMyProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        address: req.body.address,
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Student not found" });
    }

    const totalEnrollments = await Enrollment.countDocuments({
      student: updatedUser._id,
    });

    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      address: updatedUser.address,
      totalEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
