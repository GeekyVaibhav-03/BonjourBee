const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");

function progressPercentFromLevel(level) {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const index = Math.max(0, levels.indexOf(level));
  return Math.round(((index + 1) / levels.length) * 100);
}

function inLast7Days(date) {
  const now = Date.now();
  const value = new Date(date).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - value <= sevenDays;
}

async function buildStudentStats(userId) {
  const [user, progress] = await Promise.all([
    User.findById(userId),
    Progress.find({ userId })
      .populate("lessonId", "title level type durationMinutes xpReward")
      .sort({ updatedAt: -1 }),
  ]);

  if (!user) return null;

  const completedLessons = progress.filter((entry) => entry.completed).length;
  const totalTimeSpent = progress.reduce((sum, entry) => sum + (entry.timeSpentMinutes || 0), 0);
  const weeklyTimeSpent = progress
    .filter((entry) => inLast7Days(entry.updatedAt))
    .reduce((sum, entry) => sum + (entry.timeSpentMinutes || 0), 0);

  const completedIds = new Set(
    progress.filter((entry) => entry.completed).map((entry) => String(entry.lessonId?._id || entry.lessonId)),
  );

  const recommendedLessons = await Lesson.find({
    level: user.level,
    _id: { $nin: Array.from(completedIds) },
  })
    .limit(4)
    .select("title level type zone xpReward durationMinutes");

  const recentActivity = progress.slice(0, 5).map((entry) => ({
    id: entry._id,
    lessonTitle: entry.lessonId?.title || "Lesson",
    score: entry.score,
    timeSpentMinutes: entry.timeSpentMinutes,
    completed: entry.completed,
    updatedAt: entry.updatedAt,
  }));

  return {
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      level: user.level,
      zone: user.zone,
      xp: user.xp,
      streak: user.streak,
      badges: user.badges,
      dailyGoal: user.dailyGoal,
    },
    metrics: {
      completedLessons,
      totalTimeSpent,
      weeklyTimeSpent,
      progressPercent: progressPercentFromLevel(user.level),
    },
    recommendedLessons,
    recentActivity,
  };
}

router.get("/", auth, async (req, res) => {
  try {
    const requester = await User.findById(req.user.id).populate(
      "children",
      "name age level xp streak zone",
    );

    if (!requester) {
      return res.status(404).json({ error: "User not found" });
    }

    if (requester.role === "parent") {
      const childrenStats = [];

      for (const child of requester.children) {
        const childStats = await buildStudentStats(child._id);
        if (childStats) {
          childrenStats.push(childStats);
        }
      }

      return res.json({
        role: "parent",
        parent: {
          id: requester._id,
          name: requester.name,
          email: requester.email,
        },
        childrenStats,
      });
    }

    const studentStats = await buildStudentStats(requester._id);
    return res.json({ role: "student", ...studentStats });
  } catch (error) {
    console.error("Stats fetch error", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
