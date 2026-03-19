const { Schema, model } = require("mongoose");

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    type: {
      type: String,
      enum: ["audio", "speaking", "game"],
      required: true,
    },
    zone: {
      type: String,
      enum: ["kids", "teen", "adult"],
      required: true,
    },
    durationMinutes: { type: Number, default: 10 },
    xpReward: { type: Number, default: 20 },
    audioUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    content: { type: String, default: "" },
    quiz: [
      {
        question: String,
        options: [String],
        answer: String,
      },
    ],
  },
  { timestamps: true },
);

lessonSchema.index({ level: 1, type: 1, zone: 1 });

module.exports = model("Lesson", lessonSchema);
