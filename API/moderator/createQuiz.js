const createQuiz = {
  name: "PAWAN BHAI TEST - 1",
  start_time: new Date(),
  end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // * add 1 hour to start_time and set it to end_time
  duration: "60",
  questions: [],
  allowedSections: ["45"],
  marksPerQuestion: 1,
  published: true,
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-access-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWNlMTgxY2NhOTZlZmU4YTlhNzQwMyIsImlhdCI6MTY5MzMwODIwMywiZXhwIjoxNjkzMzk0NjAzfQ.WijmmlHWUv4orMiTssLN-WMJ-yYkxFFLFt22d54hZUk",
  },
  body: JSON.stringify(createQuiz),
};

fetch("http://localhost:5000/api/teacher/quiz/create-quiz", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
