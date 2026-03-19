const router = require("express").Router();
const auth = require("../middleware/auth");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const User = require("../models/User");

const learningActivityBadges = {
  puzzle: "Puzzle Solver",
  quiz: "Quiz Finisher",
  tutorial: "Tutorial Explorer",
};
const masterLearningBadge = "French Learning Games Champion";

function awardBadges(user, completedLessonsCount) {
  const earned = new Set(user.badges || []);

  if (completedLessonsCount >= 1) earned.add("First Lesson");
  if ((user.xp || 0) >= 100) earned.add("100 XP Starter");
  if ((user.xp || 0) >= 500) earned.add("500 XP Achiever");
  if ((user.streak || 0) >= 7) earned.add("7 Day Streak");

  user.badges = Array.from(earned);
}

function awardLearningActivityBadge(user, activity) {
  const activityBadge = learningActivityBadges[activity];
  if (!activityBadge) {
    return null;
  }

  const earned = new Set(user.badges || []);
  const newlyAwarded = [];

  if (!earned.has(activityBadge)) {
    earned.add(activityBadge);
    newlyAwarded.push(activityBadge);
  }

  const completedAll = Object.values(learningActivityBadges).every((badge) =>
    earned.has(badge),
  );

  if (completedAll && !earned.has(masterLearningBadge)) {
    earned.add(masterLearningBadge);
    newlyAwarded.push(masterLearningBadge);
  }

  user.badges = Array.from(earned);

  return {
    activityBadge,
    completedAll,
    newlyAwarded,
  };
}

router.post("/activity-complete", auth, async (req, res) => {
  try {
    const { activity } = req.body;

    if (!activity || !learningActivityBadges[activity]) {
      return res.status(400).json({
        error: "activity must be one of: puzzle, quiz, tutorial",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const awardResult = awardLearningActivityBadge(user, activity);
    await user.save();

    return res.json({
      activity,
      activityBadge: awardResult.activityBadge,
      completedAll: awardResult.completedAll,
      newlyAwarded: awardResult.newlyAwarded,
      badges: user.badges,
      message:
        awardResult.newlyAwarded.length > 0
          ? "Badge awarded successfully"
          : "Activity already completed",
    });
  } catch (error) {
    console.error("Activity completion error", error);
    return res.status(500).json({ error: "Failed to update activity completion" });
  }
});

router.post("/update", auth, async (req, res) => {
  try {
    const { lessonId, completed = false, score = 0, quizScore = 0, timeSpentMinutes = 0 } =
      req.body;

    if (!lessonId) {
      return res.status(400).json({ error: "lessonId is required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let progress = await Progress.findOne({ userId: req.user.id, lessonId });
    if (!progress) {
      progress = new Progress({ userId: req.user.id, lessonId });
    }

    const wasCompleted = progress.completed;

    progress.completed = Boolean(completed) || progress.completed;
    progress.score = Math.max(Number(score) || 0, progress.score || 0);
    progress.quizScore = Math.max(Number(quizScore) || 0, progress.quizScore || 0);
    progress.timeSpentMinutes += Math.max(Number(timeSpentMinutes) || 0, 0);
    progress.attempts += 1;
    progress.lastAccessedAt = new Date();

    let xpDelta = 0;
    if (progress.completed && !wasCompleted) {
      xpDelta = lesson.xpReward || 0;
      progress.xpEarned = xpDelta;
      user.xp += xpDelta;
    }

    await progress.save();

    const completedLessonsCount = await Progress.countDocuments({
      userId: req.user.id,
      completed: true,
    });

    awardBadges(user, completedLessonsCount);
    await user.save();

    return res.json({
      progress,
      xpDelta,
      userStats: {
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error("Progress update error", error);
    return res.status(500).json({ error: "Failed to update progress" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id })
      .populate("lessonId", "title level type zone xpReward durationMinutes")
      .sort({ updatedAt: -1 });

    const completedLessons = progress.filter((entry) => entry.completed).length;
    const totalTimeSpent = progress.reduce(
      (acc, entry) => acc + (entry.timeSpentMinutes || 0),
      0,
    );

    return res.json({
      progress,
      summary: {
        completedLessons,
        totalTimeSpent,
      },
    });
  } catch (error) {
    console.error("Progress fetch error", error);
    return res.status(500).json({ error: "Failed to fetch progress" });
  }
});

module.exports = router;
