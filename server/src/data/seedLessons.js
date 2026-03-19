const Lesson = require("../models/Lesson");
const lessonSeedData = require("./lessonSeedData");

module.exports = async function seedLessons() {
  if (!Array.isArray(lessonSeedData) || lessonSeedData.length === 0) {
    return;
  }

  const operations = lessonSeedData.map((lesson) => ({
    updateOne: {
      filter: { title: lesson.title },
      update: { $set: lesson },
      upsert: true,
    },
  }));

  const result = await Lesson.bulkWrite(operations, { ordered: false });
  const upsertedCount = result.upsertedCount || 0;
  const modifiedCount = result.modifiedCount || 0;

  if (upsertedCount > 0 || modifiedCount > 0) {
    console.log(
      `Seeded lessons (added: ${upsertedCount}, updated: ${modifiedCount})`,
    );
  }
};
