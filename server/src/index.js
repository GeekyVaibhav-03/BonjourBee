const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connect = require("./db/mongo");
const seedLessons = require("./data/seedLessons");

dotenv.config();

const app = express();

const allowedOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOriginPattern.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(morgan("dev"));

// Basic rate-limit for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/stats", require("./routes/stats"));

const PORT = process.env.PORT || 4000;

connect()
  .then(() => {
    return seedLessons();
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect failed", err);
    process.exit(1);
  });
