import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../../middleware/auth.js";
import { Quiz } from "../../models/Quiz.js";
import { AssessmentAttempt } from "../../models/AssessmentAttempt.js";

const router = Router();

const getNextDifficulty = (wasCorrect, currentDifficulty) => {
  if (!wasCorrect) {
    return currentDifficulty === "hard" ? "medium" : "easy";
  }
  if (currentDifficulty === "easy") {
    return "medium";
  }
  if (currentDifficulty === "medium") {
    return "hard";
  }
  return "hard";
};

const pickQuestion = (questions, difficulty, askedPrompts) =>
  questions.find(
    (question) =>
      question.difficulty === difficulty && !askedPrompts.includes(question.prompt)
  ) ||
  questions.find((question) => !askedPrompts.includes(question.prompt));

router.get("/quizzes", requireAuth, async (_req, res, next) => {
  try {
    const quizzes = await Quiz.find({}, { questions: 0 }).sort({ title: 1 });
    res.json({ quizzes });
  } catch (error) {
    next(error);
  }
});

router.post("/start", requireAuth, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.body.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const firstQuestion = pickQuestion(quiz.questions, "easy", []);

    const attempt = await AssessmentAttempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      adaptiveTrail: [firstQuestion.difficulty]
    });

    res.json({
      attemptId: attempt._id,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        timeLimitMinutes: quiz.timeLimitMinutes,
        totalQuestions: quiz.totalQuestions
      },
      question: firstQuestion
    });
  } catch (error) {
    next(error);
  }
});

router.post("/answer", requireAuth, async (req, res, next) => {
  try {
    const { attemptId, questionPrompt, selectedAnswer } = req.body;
    const attempt = await AssessmentAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Assessment attempt not found." });
    }

    if (String(attempt.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only answer your own assessment." });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    const question = quiz?.questions.find((item) => item.prompt === questionPrompt);

    if (!quiz || !question) {
      return res.status(404).json({ message: "Question not found in selected quiz." });
    }

    const wasCorrect = question.correctAnswer === selectedAnswer;

    attempt.answers.push({
      questionPrompt: question.prompt,
      skill: question.skill,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      wasCorrect,
      difficulty: question.difficulty
    });

    const scoreRatio = attempt.answers.filter((answer) => answer.wasCorrect).length / quiz.totalQuestions;
    attempt.score = Math.round(scoreRatio * 100);

    const askedPrompts = attempt.answers.map((answer) => answer.questionPrompt);
    const nextDifficulty = getNextDifficulty(wasCorrect, question.difficulty);
    const nextQuestion = pickQuestion(quiz.questions, nextDifficulty, askedPrompts);

    if (nextQuestion && attempt.answers.length < quiz.totalQuestions) {
      attempt.adaptiveTrail.push(nextQuestion.difficulty);
    } else {
      attempt.completedAt = new Date();
      attempt.readinessImpact = Math.round((attempt.score / 100) * 15);
    }

    await attempt.save();

    res.json({
      attemptId: attempt._id,
      finished: !nextQuestion || attempt.answers.length >= quiz.totalQuestions,
      score: attempt.score,
      nextQuestion:
        !nextQuestion || attempt.answers.length >= quiz.totalQuestions
          ? null
          : nextQuestion
    });
  } catch (error) {
    next(error);
  }
});

router.get("/attempts/:attemptId", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.attemptId)) {
      return res.status(400).json({ message: "Invalid attempt id." });
    }

    const attempt = await AssessmentAttempt.findById(req.params.attemptId).populate(
      "quizId",
      "title domain timeLimitMinutes"
    );

    if (!attempt) {
      return res.status(404).json({ message: "Assessment attempt not found." });
    }

    if (String(attempt.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only access your own assessment." });
    }

    res.json({ attempt });
  } catch (error) {
    next(error);
  }
});

export default router;
