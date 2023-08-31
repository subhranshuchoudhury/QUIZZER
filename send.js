const data = {
  questions: [
    {
      question: "What is the capital of India?",
      options: [
        {
          option: "New Delhi",
          is_correct: true,
        },
        {
          option: "Mumbai",
          is_correct: false,
        },
        {
          option: "Kolkata",
          is_correct: false,
        },
        {
          option: "Chennai",
          is_correct: false,
        },
      ],
    },
  ],
};

const createQuiz = {
  name: "TEST - 1",
  start_time: new Date(),
  end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // * add 1 hour to start_time and set it to end_time
  duration: 60,
};

const data3 = {
  exam_id: "64e7a5974ac9623e567e235d",
  question: {
    question: "What is the capital of India?",
    options: [
      {
        option: "New Delhi",
        is_correct: true,
      },
      {
        option: "Mumbai",
        is_correct: false,
      },
      {
        option: "Kolkata",
        is_correct: false,
      },
      {
        option: "Chennai",
        is_correct: false,
      },
    ],
  },
};

const data4 = {
  exam_id: "64e79f225e49d0112afea7b6",
  question_id: "64e79f225e49d0112afea7b7",
  question: {
    question: "Who is the developer of the application? 🚀",
    options: [
      {
        option: "Subhranshu",
        is_correct: true,
      },
      {
        option: "Helsjinki",
        is_correct: false,
      },
      {
        option: "Rio",
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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTgzZDU0NjQxMTY0NTdiMDZhMmEzOCIsImlhdCI6MTY5Mjk0MjI0NSwiZXhwIjoxNjkzMDI4NjQ1fQ.lAa0PRtqWavdt1dAnmMY_g9sDJs21SqUDENe_tBPOY8",
  },
  body: JSON.stringify(createQuiz),
};

fetch("http://localhost:5000/api/create-quiz", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
