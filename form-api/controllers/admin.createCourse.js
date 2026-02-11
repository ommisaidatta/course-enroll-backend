const Course = require("../models/course");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, duration, level } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(409).json({
        message: "Course with this title already exists",
      });
    }

    // Create new course
    const course = await Course.create({
      title,
      description,
      category,
      duration,
      level,
      // createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
