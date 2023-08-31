const db = require("../models");
const Student = db.student;

const validateRegisterInput = (req, res, next) => {
  const { regdNo, password } = req.body;

  const requiredFields = [
    { field: regdNo, message: "Registration number is required" },
    { field: password, message: "Password is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const regex = /^\d{10}$/;

  if (!regex.test(regdNo)) {
    return res.status(400).json({ message: "Registration number is invalid" });
  }

  next();
};

const checkDuplicateRegdNo = async (req, res, next) => {
  const { regdNo } = req.body;

  try {
    const student = await Student.findOne({ regdNo });
    if (student) {
      return res.status(400).json({ message: "Registration number is taken" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const studentSignUp = {
  validateRegisterInput,
  checkDuplicateRegdNo,
};

module.exports = studentSignUp;
