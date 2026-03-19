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

const allowedOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function parseOriginList(value) {
  return String(value || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
}

const configuredOrigins = new Set([
  ...parseOriginList(process.env.CORS_ORIGIN),
  ...parseOriginList(process.env.CORS_ORIGINS),
]);
const allowAllOrigins =
  String(process.env.CORS_ALLOW_ALL || "").toLowerCase() === "true";

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = normalizeOrigin(origin);

      if (
        !origin ||
        allowAllOrigins ||
        allowedOriginPattern.test(origin) ||
        configuredOrigins.has(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
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
