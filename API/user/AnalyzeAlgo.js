const actualAnswer = [
  {
    questionId: "64e84d506763cec4adb1f6ce",
    correctId: "64e84ef29e13133069cd840c",
  },
  {
    questionId: "64e84d506763cec4adb1f6cf",
    correctId: "64e84ef29e13133069cd840d",
  },
];

const userAnswer = [
  {
    questionId: "64e84d506763cec4adb1f6cf",
    correctId: "64e84ef29e13133069cd840d",
  },
  {
    questionId: "64e84d506763cec4adb1f6ce",
    correctId: "64e84ef29e13133069cd840c",
  },
  {
    questionId: "64e84d506763cec4adb1f6cf",
    correctId: "64e84ef29e13133069cd840d",
  },
  {
    questionId: "64e84d506763cec4adb1f6ce",
    correctId: "64e84ef29e13133069cd840c",
  },
  {
    questionId: "64e84d506763cec4adb1f6cf",
    correctId: "64e84ef29e13133069cd840d",
  },
  {
    questionId: "64e84d506763cec4adb1f6ce",
    correctId: "64e84ef29e13133069cd840c",
  },
];

const uniqueUserAnswers = userAnswer.filter((answer, index, array) => {
  return array.findIndex((a) => a.questionId === answer.questionId) === index;
});

let score = 0;
for (let i = 0; i < uniqueUserAnswers.length; i++) {
  let answer = uniqueUserAnswers[i];
  let question = actualAnswer.find((q) => q.questionId === answer.questionId);
  if (question && question.correctId === answer.correctId) {
    score++;
  }
}
console.log(`Final score: ${score}`);
