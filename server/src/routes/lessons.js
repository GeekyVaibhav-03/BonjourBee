const router = require("express").Router();
const auth = require("../middleware/auth");
const Lesson = require("../models/Lesson");

router.get("/", auth, async (req, res) => {
  try {
    const { level, type, zone } = req.query;
    const query = {};

    if (level) query.level = level;
    if (type) query.type = type;
    if (zone) query.zone = zone;

    const lessons = await Lesson.find(query).sort({ level: 1, createdAt: 1 });
    return res.json({ lessons });
  } catch (error) {
    console.error("Lessons fetch error", error);
    return res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    return res.json({ lesson });
  } catch (error) {
    console.error("Lesson fetch error", error);
    return res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

module.exports = router;
