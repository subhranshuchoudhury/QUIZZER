const updateQuiz = {
  quizId: "64edd9a3a6ff9cde0a07cd45",
  question: {
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
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-access-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWNlMTgxY2NhOTZlZmU4YTlhNzQwMyIsImlhdCI6MTY5MzMwODIwMywiZXhwIjoxNjkzMzk0NjAzfQ.WijmmlHWUv4orMiTssLN-WMJ-yYkxFFLFt22d54hZUk",
  },
  body: JSON.stringify(updateQuiz),
};

fetch("http://localhost:5000/api/teacher/quiz/add-quiz-question", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
