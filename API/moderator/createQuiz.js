const questions = [
  {
    question: "Who is the developer of the application?",
    options: [
      {
        option: "Subhranshu",
        is_correct: true,
      },
      {
        option: "Helsinki",
        is_correct: false,
      },
      {
        option: "Tokyo",
        is_correct: false,
      },
      {
        option: "Professor",
        is_correct: false,
      },
    ],
  },
  {
    question: "Who is a avenger?",
    options: [
      {
        option: "Bat Man",
        is_correct: false,
      },
      {
        option: "Iron Man",
        is_correct: true,
      },
      {
        option: "Flash",
        is_correct: false,
      },
      {
        option: "Super Man",
        is_correct: false,
      },
    ],
  },
];

const createQuiz = {
  name: "TEST ONE TIME MULTIPLE QUESTION",
  start_time: new Date(),
  end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // * add 1 hour to start_time and set it to end_time
  duration: "60",
  questions,
  allowedSections: ["45"],
  marksPerQuestion: 1,
  published: true,
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-access-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjIxYTQzZGJkMTdmN2QzODVkYjY1NCIsImlhdCI6MTY5MzgwOTcwOSwiZXhwIjoxNjkzODk2MTA5fQ.WoiZCp88c9Uf5_sB0FxjLHIR5Wv6Yew52ESgtC-q9KI",
  },
  body: JSON.stringify(createQuiz),
};

fetch("http://localhost:5000/api/teacher/quiz/create-quiz", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
