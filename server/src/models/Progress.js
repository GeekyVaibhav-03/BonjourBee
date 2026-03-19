const { Schema, model } = require("mongoose");

const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    quizScore: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    timeSpentMinutes: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = model("Progress", progressSchema);