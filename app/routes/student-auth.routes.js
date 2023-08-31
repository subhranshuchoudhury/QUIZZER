const { studentSignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/student-auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // * Student routes

  app.post(
    "/api/student/auth/register",
    [studentSignUp.validateRegisterInput],
    [studentSignUp.checkDuplicateRegdNo],
    controller.studentRegister
  );
  

  app.post(
    "/api/student/auth/login",
    [studentSignUp.validateRegisterInput],
    controller.studentLogin
  );
};
