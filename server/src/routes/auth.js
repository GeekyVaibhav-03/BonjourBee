const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sanitizeUser, signAccessToken } = require("../utils/token");

function getDayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function computeStreak(lastLoginDate, currentStreak) {
  if (!lastLoginDate) return 1;

  const todayKey = getDayKey(new Date());
  const lastKey = getDayKey(lastLoginDate);

  if (todayKey === lastKey) return currentStreak || 1;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDayKey(yesterday);

  if (lastKey === yesterdayKey) {
    return (currentStreak || 0) + 1;
  }

  return 1;
}

router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      role = "student",
      name,
      age,
      parentEmail,
      childEmail,
    } = req.body;

    if (!email || !password || !name || !age) {
      return res
        .status(400)
        .json({ error: "Name, age, email, and password are required" });
    }

    if (!["student", "parent"].includes(role)) {
      return res.status(400).json({ error: "Role must be student or parent" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 99) {
      return res.status(400).json({ error: "Age must be between 5 and 99" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      role,
      name: String(name).trim(),
      age: ageNum,
      streak: 1,
      lastLoginDate: new Date(),
    });

    // Link student to parent during registration.
    if (role === "student" && parentEmail) {
      const parent = await User.findOne({
        email: String(parentEmail).trim().toLowerCase(),
        role: "parent",
      });

      if (parent) {
        user.parentId = parent._id;
        await user.save();

        parent.children.addToSet(user._id);
        await parent.save();
      }
    }

    // Link parent to existing child during registration.
    if (role === "parent" && childEmail) {
      const child = await User.findOne({
        email: String(childEmail).trim().toLowerCase(),
        role: "student",
      });

      if (child) {
        child.parentId = user._id;
        await child.save();

        user.children.addToSet(child._id);
        await user.save();
      }
    }

    const token = signAccessToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Register error", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.streak = computeStreak(user.lastLoginDate, user.streak);
    user.lastLoginDate = new Date();
    await user.save();

    const token = signAccessToken(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

router.get("/me", auth, async (req, res) => {
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
    console.error("Me error", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
