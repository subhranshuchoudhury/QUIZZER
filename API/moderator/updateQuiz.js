const updateQuiz = {
  quizId: "64e84aa3d35efd192e97744f",
  name: "TEST - 2",
  start_time: new Date(),
  end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // * add 1 hour to start_time and set it to end_time
  duration: 100,
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

fetch("http://localhost:5000/api/update-quiz", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
