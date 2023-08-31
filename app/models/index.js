const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.teacher = require("./teacher.model");
db.quiz = require("./quiz.model");
db.student = require("./student.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
