import { JobRole } from "../models/JobRole.js";
import { Quiz } from "../models/Quiz.js";
import { jobRoles } from "../data/jobRoles.js";
import { quizzes } from "../data/quizzes.js";

export const seedCoreData = async () => {
  const existingRoles = await JobRole.countDocuments();
  const existingQuizzes = await Quiz.countDocuments();

  if (existingRoles === 0) {
    await JobRole.insertMany(jobRoles);
    console.log("Seeded job roles");
  }

  if (existingQuizzes === 0) {
    await Quiz.insertMany(quizzes);
    console.log("Seeded quizzes");
  }
};

