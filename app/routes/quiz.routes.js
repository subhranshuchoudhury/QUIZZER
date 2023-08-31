const { authJwt, verifyQuiz } = require("../middlewares");
const controller = require("../controllers/quiz.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/teacher/quiz/create-quiz",
    [authJwt.verifyToken],
    [verifyQuiz.validateCreateQuiz],
    [authJwt.isModerator],
    controller.createQuiz
  );

  app.post(
    "/api/teacher/quiz/update-quiz",
    [authJwt.verifyToken],
    [verifyQuiz.validateUpdateQuiz],
    [authJwt.isModerator],
    controller.updateQuiz
  );

  app.post(
    "/api/teacher/quiz/add-quiz-question",
    [authJwt.verifyToken],
    [verifyQuiz.validateAddQuestion],
    [authJwt.isModerator],
    controller.addQuestion
  );

  app.post(
    "/api/teacher/quiz/update-quiz-question",
    [authJwt.verifyToken],
    [verifyQuiz.validateUpdateQuizQuestion],
    [authJwt.isModerator],
    controller.updateQuizQuestion
  );

  app.post(
    "/api/teacher/quiz/delete-quiz",
    [authJwt.verifyToken],
    [verifyQuiz.validateDeleteQuiz],
    [authJwt.isModerator],
    controller.deleteQuiz
  );

  app.post(
    "/api/teacher/quiz/delete-quiz-question",
    [authJwt.verifyToken],
    [verifyQuiz.validateDeleteQuizQuestion],
    [authJwt.isModerator],
    controller.deleteQuizQuestion
  );

  app.post(
    "/api/get/quiz/id",
    [authJwt.verifyToken],
    [verifyQuiz.validateGetQuizById],
    controller.getQuiz
  );

  app.post("/api/get/quiz/share", [authJwt.verifyToken], controller.getQuiz);

  app.post(
    "/api/get/quiz/analyze",
    [authJwt.verifyToken],
    [verifyQuiz.validateGetQuizAnalyze],
    controller.getQuizAnalyze
  );
};
