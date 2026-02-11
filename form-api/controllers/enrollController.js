const Enrollment = require("../models/enrollment");
const CourseProgress = require("../models/progress");
const Lesson = require("../models/lesson");

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // from JWT middleware

    const alreadyEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      progress: 0,
      status: "Active",
    });

    res.status(201).json({
      message: "Course enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: "Enrollment failed" });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({
      user: userId,
    }).populate("course");

    const result = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.course._id.toString();
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const courseProgress = await CourseProgress.findOne({
          userId,
          courseId,
        });
        const completedCount = courseProgress
          ? courseProgress.completedLessons.length
          : 0;
        const progress =
          totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;
        const status = progress === 100 ? "Completed" : enrollment.status;

        return {
          ...enrollment.toObject(),
          progress,
          status,
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};
