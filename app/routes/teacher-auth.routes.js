const { teacherSignup, authJwt } = require("../middlewares");
const controller = require("../controllers/teacher-auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // * define routes here.

  app.post(
    "/api/teacher/auth/register",
    [teacherSignup.validateInput],
    [teacherSignup.checkDuplicateEmail],
    controller.teacherRegister
  );

  app.post(
    "/api/teacher/auth/login",
    [teacherSignup.validateLoginInput],
    controller.teacherLogin
  );

  app.post(
    "/api/teacher/auth/send-otp",
    [teacherSignup.validateSendOTPInput],
    controller.sendOTPTeacher
  );

  app.post(
    "/api/teacher/auth/verify",
    [teacherSignup.validateVerifyInput],
    controller.verifyTeacher
  );

  

  app.post(
    "/api/teacher/auth/forgot-password",
    [teacherSignup.validateVerifyInput],
    [teacherSignup.validateLoginInput],
    controller.forgetPasswordTeacher
  );

  app.post(
    "/api/teacher/auth/change-password",
    [authJwt.verifyToken],
    [teacherSignup.validateChangePasswordInput],
    controller.changePasswordTeacher
  );
};
