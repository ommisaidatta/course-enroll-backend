const CourseProgress = require("../models/progress");

exports.getProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const progress = await CourseProgress.findOne({ userId, courseId });
  const completedLessons = progress
    ? progress.completedLessons.map((id) => id.toString())
    : [];

  res.json({ completedLessons });
};

exports.completeLesson = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user.id;

  let progress = await CourseProgress.findOne({ userId, courseId });
  const alreadyCompleted = progress?.completedLessons.some(
    (id) => id.toString() === lessonId
  );

  if (!progress) {
    progress = await CourseProgress.create({
      userId,
      courseId,
      completedLessons: [lessonId],
    });
  } else if (!alreadyCompleted) {
    progress.completedLessons.push(lessonId);
    await progress.save();
  }

  const completedLessons = progress.completedLessons.map((id) =>
    id.toString()
  );
  res.json({ ...progress.toObject(), completedLessons });
};
