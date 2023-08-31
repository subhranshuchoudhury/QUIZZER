const db = require("../models");
const Quiz = db.quiz;

const validateCreateQuiz = (req, res, next) => {
  const {
    name,
    start_time,
    end_time,
    duration,
    questions,
    allowedSections,
    marksPerQuestion,
    published,
  } = req.body;

  const requiredFields = [
    { field: name, message: "Quiz name is required" },
    { field: start_time, message: "Start time is required" },
    { field: end_time, message: "End time is required" },
    { field: duration, message: "Duration is required" },
    { field: questions, message: "Question is required" },
    { field: allowedSections, message: "Allowed sections is required" },
    { field: marksPerQuestion, message: "Marks per question is required" },
    { field: published, message: "Publish info is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  // * check if start_time is less than end_time
  if (start_time > end_time) {
    return res.status(400).json({ message: "Invalid start time" });
  }

  next();
};

const validateAddQuestion = (req, res, next) => {
  const { quizId, question } = req.body;
  const requiredFields = [
    { field: quizId, message: "Quiz ID is required" },
    { field: question, message: "Question is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const validateUpdateQuiz = (req, res, next) => {
  const { quizId, name, start_time, end_time, duration } = req.body;
  const requiredFields = [
    { field: quizId, message: "Quiz ID is required" },
    { field: name, message: "Quiz name is required" },
    { field: start_time, message: "Start time is required" },
    { field: end_time, message: "End time is required" },
    { field: duration, message: "Duration is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const validateUpdateQuizQuestion = (req, res, next) => {
  const { quizId, questionId, question } = req.body;
  const requiredFields = [
    { field: quizId, message: "Quiz ID is required" },
    { field: questionId, message: "Question ID is required" },
    { field: question, message: "Question is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const validateDeleteQuiz = (req, res, next) => {
  const { quizId } = req.body;
  const requiredFields = [{ field: quizId, message: "Quiz ID is required" }];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const validateDeleteQuizQuestion = (req, res, next) => {
  const { quizId, questionId } = req.body;
  const requiredFields = [
    { field: quizId, message: "Quiz ID is required" },
    { field: questionId, message: "Question ID is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const validateGetQuizById = (req, res, next) => {
  const { quizId } = req.body;
  const requiredFields = [{ field: quizId, message: "Quiz ID is required" }];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const validateGetQuizAnalyze = (req, res, next) => {
  const { quizId, userAnswer } = req.body;
  const requiredFields = [
    { field: quizId, message: "Quiz ID is required" },
    { field: userAnswer, message: "Selected answers is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  next();
};

const verifyQuiz = {
  validateCreateQuiz,
  validateAddQuestion,
  validateDeleteQuiz,
  validateDeleteQuizQuestion,
  validateGetQuizAnalyze,
  validateGetQuizById,
  validateUpdateQuiz,
  validateUpdateQuizQuestion,
};

module.exports = verifyQuiz;
