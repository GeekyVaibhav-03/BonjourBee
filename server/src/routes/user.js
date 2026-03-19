const router = require("express").Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const User = require("../models/User");
const { sanitizeUser, signAccessToken } = require("../utils/token");

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "children",
      "name age level xp streak zone",
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Profile fetch error", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.put("/update", auth, async (req, res) => {
  try {
    const {
      name,
      age,
      level,
      dailyGoal,
      notificationsEnabled,
      currentPassword,
      newPassword,
      childEmail,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      user.name = String(name).trim();
    }

    if (age !== undefined) {
      const ageNum = Number(age);
      if (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 99) {
        return res.status(400).json({ error: "Age must be between 5 and 99" });
      }
      user.age = ageNum;
    }

    if (level !== undefined) {
      const allowed = ["A1", "A2", "B1", "B2", "C1", "C2"];
      if (!allowed.includes(level)) {
        return res.status(400).json({ error: "Invalid CEFR level" });
      }
      user.level = level;
    }

    if (dailyGoal !== undefined) {
      user.dailyGoal = Math.max(5, Number(dailyGoal) || 20);
    }

    if (notificationsEnabled !== undefined) {
      user.notificationsEnabled = Boolean(notificationsEnabled);
    }

    if (newPassword !== undefined) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      if (String(newPassword).length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (user.role === "parent" && childEmail) {
      const child = await User.findOne({
        email: String(childEmail).trim().toLowerCase(),
        role: "student",
      });

      if (!child) {
        return res.status(404).json({ error: "Student account not found for child email" });
      }

      child.parentId = user._id;
      await child.save();

      user.children.addToSet(child._id);
    }

    await user.save();

    const refreshed = await User.findById(user._id).populate(
      "children",
      "name age level xp streak zone",
    );

    return res.json({
      user: sanitizeUser(refreshed),
      token: signAccessToken(refreshed),
    });
  } catch (error) {
    console.error("Profile update error", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
