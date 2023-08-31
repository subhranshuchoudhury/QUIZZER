const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    options: [
      {
        option: {
          type: String,
          required: true,
          min: 6,
          max: 255,
        },
        is_correct: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
