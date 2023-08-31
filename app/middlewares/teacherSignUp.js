const db = require("../models");
const Teacher = db.teacher;

const validateInput = (req, res, next) => {
  const { name, email, password, subject, primaryPhone, regdNo } = req.body;
  const requiredFields = [
    { field: name, message: "Name is required" },
    { field: email, message: "Email is required" },
    { field: password, message: "Password is required" },
    { field: subject, message: "Subject is required" },
    { field: primaryPhone, message: "Primary phone number is required" },
    { field: regdNo, message: "Registration number is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //   if (!passwordRegex.test(password)) {
  //     return res.status(400).json({
  //       message:
  //         "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number",
  //     });
  //   }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(primaryPhone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const emailDomain = email.split("@")[1];
  const allowedDomains = ["soa.ac.in", "gmail.com"]; // ! CAREFUL WHILE CHANGING THIS.
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({
      message: `Invalid email domain, should contain ${allowedDomains.join(
        ", "
      )}`,
    });
  }

  next();
};

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (teacher) {
      if (teacher.verified)
        return res.status(400).json({ message: "Email is already in use!" });
      else {
        return res.status(301).json({
          message: "Email is already in use! Please verify your email.",
        });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const requiredFields = [
    { field: email, message: "Email is required" },
    { field: password, message: "Password is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const emailDomain = email.split("@")[1];
  const allowedDomains = ["soa.ac.in", "gmail.com"]; // ! CAREFUL WHILE CHANGING THIS.
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({
      message: `Invalid email`,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password is incorrect" });
  }

  next();
};

const validateVerifyInput = (req, res, next) => {
  const { otp, email } = req.body;
  const requiredFields = [
    { field: otp, message: "OTP is required" },
    { field: email, message: "Email is required" },
  ];
  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const emailDomain = email.split("@")[1];
  const allowedDomains = ["soa.ac.in", "gmail.com"]; // ! CAREFUL WHILE CHANGING THIS.
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({
      message: `Invalid email`,
    });
  }

  next();
};

const validateSendOTPInput = (req, res, next) => {
  const { email } = req.body;
  const requiredFields = [{ field: email, message: "Email is required" }];
  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  const emailDomain = email.split("@")[1];
  const allowedDomains = ["soa.ac.in", "gmail.com"]; // ! CAREFUL WHILE CHANGING THIS.
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({
      message: `Invalid email`,
    });
  }

  next();
};

const validateChangePasswordInput = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const requiredFields = [
    { field: oldPassword, message: "Old password is required" },
    { field: newPassword, message: "New password is required" },
  ];
  for (const { field, message } of requiredFields) {
    if (!field) {
      return res.status(400).json({ message });
    }
  }

  if (oldPassword === newPassword) {
    return res.status(400).json({ message: "New password cannot be same" });
  }

  if (oldPassword.length < 6) {
    return res.status(400).json({ message: "Old password is too short" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password is too short" });
  }

  next();
};

const teacherSignUp = {
  validateInput,
  validateVerifyInput,
  validateSendOTPInput,
  validateChangePasswordInput,
  validateLoginInput,
  checkDuplicateEmail,
};

module.exports = teacherSignUp;
