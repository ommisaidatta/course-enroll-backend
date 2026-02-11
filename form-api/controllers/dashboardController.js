exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrolledCount = await Enrollment.countDocuments({
      user: userId,
    });

    const ratings = await Rating.find({ user: userId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0);

    res.json({
      enrolledCourses: enrolledCount,
      averageRating: avgRating.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: "Stats fetch failed" });
  }
};
