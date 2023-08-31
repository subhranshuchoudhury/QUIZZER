const { authJwt } = require("../middlewares");
const controller = require("../controllers/test.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //   app.get("/api/user/keeps", [authJwt.verifyToken], controller.keeps);
  app.get(
    "/api/test",
    [authJwt.verifyToken],
    [authJwt.isModerator],
    controller.testAuth
  );

  app.get("/api/test/ip", controller.testAuthTwo);
  app.get("/api/test/compression", controller.testCompression);
};
