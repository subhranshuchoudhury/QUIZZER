const oldArray = [
  {
    question: "Who is the avenger?",
    option1: "Iron Man",
    option2: "Bat Man",
    option3: "Flash",
    option4: "Super Man",
    correct: 1,
  },
  {
    question: "Who is the avenger?",
    option1: "Iron Man",
    option2: "Bat Man",
    option3: "Flash",
    option4: "Super Man",
    correct: 1,
  },
];

const newArray = oldArray.map((item) => {
  return {
    question: item.question,
    options: [
      { option: item.option1, is_correct: item.correct === 1 },
      { option: item.option2, is_correct: item.correct === 2 },
      { option: item.option3, is_correct: item.correct === 3 },
      { option: item.option4, is_correct: item.correct === 4 },
    ],
  };
});

console.log(...newArray);
