const mongoose = require("mongoose");

const Teacher = mongoose.model(
  "Teacher",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    password: { type: String, required: true },
    regdNo: { type: String, required: true },
    primaryPhone: { type: String, required: true },
    verified: { type: Boolean, default: false },
    tempOTP: {
      otp: { type: String, default: null },
      createdAt: { type: Date, default: null },
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = Teacher;
