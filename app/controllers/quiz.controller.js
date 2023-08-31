const db = require("../models");
const Quiz = db.quiz;
const Student = db.student;
const redis = require("redis");
const {promisify} = require('util');

const client = redis.createClient({
  socket:{
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  }
})

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz({
      name: req.body.name,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      duration: req.body.duration,
      questions: req.body.questions,
      userId: req.userId,
      allowedSections: req.body.allowedSections,
      marksPerQuestion: req.body.marksPerQuestion,
      sharableLink: `QUIZZER_${req.body.name.replace(
        / /g,
        "_"
      )}_${new Date().getTime()}`,
    });
    await quiz.save();
    res.json({ message: "Quiz created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.body.quizId,
      userId: req.userId,
    });
    quiz.questions.push(req.body.question);
    await quiz.save();
    res.json({ message: "Question uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const response = await Quiz.findOneAndUpdate(
      { _id: req.body.quizId, userId: req.userId },
      {
        $set: {
          name: req.body.name,
          start_time: req.body.start_time,
          end_time: req.body.end_time,
          duration: req.body.duration,
        },
      }
    );

    if (response) res.json({ message: "Quiz updated" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.updateQuizQuestion = async (req, res) => {
  try {
    const response = await Quiz.findOneAndUpdate(
      {
        _id: req.body.quizId,
        userId: req.userId,
        "questions._id": req.body.questionId,
      },
      {
        $set: {
          "questions.$.question": req.body.question.question,
          "questions.$.options": req.body.question.options,
        },
      }
    );

    if (response) res.json({ message: "Question updated" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.body.quizId,
      userId: req.userId,
    });

    if (quiz) return res.json({ message: "Quiz deleted" });
    return res.json({ message: "Quiz not found" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.deleteQuizQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.body.quizId,
      userId: req.userId,
    });
    console.log(quiz);
    quiz.questions.pull(req.body.questionId);
    await quiz.save();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    // ! Change if you know what you are doing.
    // ! Dangerous

    const quizInfo = await Quiz.findOne({ _id: req.body.quizId }).select(
      "start_time end_time questions.question questions._id questions.options.option questions.options._id allowedSections attendedStudents published"
    );

    if (!quizInfo) return res.json({ message: "Quiz not found" });

    if (!quizInfo.published) return res.json({ message: "Quiz not published" });

    const questions = quizInfo.questions;
    let startExam = quizInfo.start_time;
    let endExam = quizInfo.end_time;

    if (isNaN(startExam.getTime()) || isNaN(endExam.getTime())) {
      res.json({ message: "UNEXPECTED: contact admin!" });
    } else {
      let currentTime = new Date();
      if (
        currentTime.getTime() > startExam.getTime() &&
        currentTime.getTime() < endExam.getTime()
      ) {
        const student = await Student.findOne({ _id: req.userId }).select(
          "name regdNo section"
        );
        const studentSection = student.section;
        const allowedSections = quizInfo.allowedSections;
        if (allowedSections.includes(studentSection)) {
          const studentObj = {
            name: student.name,
            regdNo: student.regdNo,
            userId: req.userId,
          };

          if (
            !quizInfo.attendedStudents.find(
              (obj) =>
                obj.name === studentObj.name &&
                obj.regdNo === studentObj.regdNo &&
                obj.userId === studentObj.userId
            )
          ) {
            quizInfo.attendedStudents.push(studentObj);
            await quizInfo.save();
          }
          return res.status(200).json(questions);
        } else {
          res.json({ message: "You are not allowed to give this quiz" });
        }
        return;
      } else {
        res.json({ message: "Quiz not started or quiz has been ended" });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
};

exports.getQuizAnalyze = async (req, res) => {
  try {
    // * get only question and only correct option
    const quiz = await Quiz.findById(req.body.quizId).select(
      "questions._id questions.options._id questions.options.is_correct attendedStudents start_time end_time published"
    );

    if (!quiz) return res.json({ message: "Quiz not found" });

    if (!quiz.published) return res.json({ message: "Quiz not published" });

    // * check if user already seen result

    let attendedStudent = quiz.attendedStudents.find((obj) => {
      return obj.userId === req.userId;
    });

    if (attendedStudent && attendedStudent.score) {
      return res.json({ message: "You result has been published" });
    }

    const startExam = quiz.start_time;
    const endExam = quiz.end_time;
    const currentTime = new Date();

    if (
      currentTime.getTime() > startExam.getTime() &&
      currentTime.getTime() < endExam.getTime()
    ) {
      return res.json({ message: "Quiz is running" });
    }

    const correctOptionIds = quiz.questions.map((question) => {
      return {
        questionId: question._id,
        correctId: question.options
          .filter((option) => option.is_correct)
          .map((option) => option._id)[0],
      };
    });

    const userAnswer = req.body.userAnswer;

    const uniqueUserAnswers = userAnswer.filter((answer, index, array) => {
      return (
        array.findIndex((a) => a.questionId === answer.questionId) === index
      );
    });

    let score = 0;
    for (let i = 0; i < uniqueUserAnswers.length; i++) {
      let answer = uniqueUserAnswers[i];
      let question = correctOptionIds.find(
        (q) => q.questionId.toString() === answer.questionId
      );
      if (question && question.correctId.toString() === answer.correctId) {
        score++;
      }
    }

    attendedStudent = quiz.attendedStudents.find(
      (obj) => obj.userId === req.userId
    );

    if (attendedStudent) {
      attendedStudent.score = score;
      await quiz.save();
      const saveScore = await SET_ASYNC(
        `QUIZ_${req.body.quizId}_${req.userId}_SCORE`,
        JSON.stringify(score),
        "EX",
        3600
      );
      console.log("CACHED DATA: ",saveScore);
      return res.status(200).json({ score });
    } else {
      return res.json({ message: "You are not attempted this quiz" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Server error" });
  }
};
