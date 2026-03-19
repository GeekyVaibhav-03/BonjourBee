const jwt = require("jsonwebtoken");

function buildTokenPayload(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    zone: user.zone,
    level: user.level,
    xp: user.xp,
    streak: user.streak,
  };
}

function signAccessToken(user) {
  return jwt.sign(
    buildTokenPayload(user),
    process.env.JWT_SECRET || "devsecret",
    { expiresIn: "7d" },
  );
}

function sanitizeUser(user) {
  const source = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...safe } = source;
  return safe;
}

module.exports = {
  signAccessToken,
  sanitizeUser,
};
