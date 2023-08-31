const mongoose = require("mongoose");
const questionModel = require("./question.model");
const { Schema, model } = mongoose;

const QuizSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  userId: {
    // * The teacher ID who initiated the quiz.
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  marksPerQuestion: {
    type: Number,
    require: true,
    default: 1,
  },
  sharableLink: {
    type: String,
    required: false,
  },
  published: {
    type: Boolean,
    required: true,
    default: false,
  },
  allowedSections: [
    {
      type: String,
      required: true,
      default: "ALLOW_ALL",
    },
  ],
  attendedStudents: [
    {
      name: { type: String, required: true },
      regdNo: { type: String, required: true },
      score: { type: Number, required: false },
      userId: { type: String, required: true },
    },
  ],
  questions: [questionModel.schema],
});

module.exports = model("Quiz", QuizSchema);
