const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "parent"], default: "student" },
    name: { type: String, required: true, trim: true },

    age: { type: Number, min: 5, max: 99 },
    zone: { type: String, enum: ["kids", "teen", "adult"], default: "teen" },
    level: { type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"], default: "A1" },

    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
    badges: [{ type: String }],

    parentId: { type: Schema.Types.ObjectId, ref: "User" },
    children: [{ type: Schema.Types.ObjectId, ref: "User" }],

    dailyGoal: { type: Number, default: 20 },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.pre("validate", function(next) {
  if (this.age) {
    if (this.age >= 5 && this.age <= 10) this.zone = "kids";
    else if (this.age >= 11 && this.age <= 16) this.zone = "teen";
    else this.zone = "adult";
  }
  next();
});

module.exports = model("User", userSchema);
