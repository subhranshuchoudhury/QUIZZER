const mongoose = require("mongoose");

const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    name: { type: String, required: true },
    regdNo: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true },
    verified: { type: Boolean, default: false },
    allowed: { type: Boolean, default: false },
    phone: { type: String, required: true },
    primaryPhone: { type: String, required: false },
    secondaryPhone: { type: String, required: false },
    admissionYear: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
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

module.exports = Student;
