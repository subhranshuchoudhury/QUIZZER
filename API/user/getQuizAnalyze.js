const updateQuiz = {
  quizId: "64edd9a3a6ff9cde0a07cd45",
  userAnswer: [
    {
      questionId: "64eddcd6146d1ed2f278ed9f",
      correctId: "64eddcd6146d1ed2f278eda0",
    },
  ],
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-access-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWRhODlhOGVkZTQ1MDJlMjExODk0NiIsImlhdCI6MTY5MzI5NzExMywiZXhwIjoxNjkzMzgzNTEzfQ.Aur86DofGOlLFoMc5ryKmoWSeR-6mag0TDWNriCOdSU",
  },
  body: JSON.stringify(updateQuiz),
};

fetch("http://localhost:5000/api/get/quiz/analyze", options)
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
  })
  .catch((err) => console.error(err));
