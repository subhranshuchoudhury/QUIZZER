const updateQuiz = {
  quizId: "64e85063c2f775681a28a2fb",
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-access-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTgzZDU0NjQxMTY0NTdiMDZhMmEzOCIsImlhdCI6MTY5Mjk0MjI0NSwiZXhwIjoxNjkzMDI4NjQ1fQ.lAa0PRtqWavdt1dAnmMY_g9sDJs21SqUDENe_tBPOY8",
  },
  body: JSON.stringify(updateQuiz),
};

fetch("http://localhost:5000/api/delete-quiz", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
