const config = require("../config/auth.config");
const db = require("../models");
const Teacher = db.teacher;
const Role = db.role;
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// * Mail Transporter

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "subhransuchoudhury00@gmail.com",
    pass: "0Zc2YJzmh7bFUEHI",
  },
});

const sendMail = async (to, subject, otp) => {
  try {
    const info = await transporter.sendMail({
      from: "' Quizzer <subhransuchoudhury00@gmail.com>'", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: `Your Quizzer password is ${otp}`, // plain text body
      html: `<b>Your ${subject} is: <h3 style="color:green;">${otp}</h3>NOTE: This should kept with safety.</b>`, // html body
    });
    console.log("Message sent:", info.messageId);
    return 200;
  } catch (error) {
    console.log(error);
    return 400;
  }
};

// * PRE PROD TESTING

exports.teacherRegister = async (req, res) => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const teacher = new Teacher({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    subject: req.body.subject,
    primaryPhone: req.body.primaryPhone,
    regdNo: req.body.regdNo,
    verified: false,
    
  });

  try {
    const roles = await Role.find({
      name: { $in: "moderator" },
    });
    teacher.roles = roles.map((role) => role._id);
    teacher.save().then((user) => {
      res.send({ message: "Account registered successfully!" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.teacherLogin = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      email: req.body.email,
    }).populate("roles", "-__v");

    if (teacher) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        teacher.password
      );

      if (!teacher.verified) {
        return res.status(301).send({
          accessToken: null,
          message: "Account not verified!",
        });
      }

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: teacher.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < teacher.roles.length; i++) {
        authorities.push("ROLE_" + teacher.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        name: teacher.name,
        email: teacher.email,
        roles: authorities,
        accessToken: token,
      });
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.verifyTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      email: req.body.email,
    });

    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    if (teacher.verified) {
      return res.status(400).send({ message: "Teacher already verified" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.otp,
      teacher.tempOTP.otp
    );

    console.log(req.body.otp, teacher.tempOTP.otp);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid OTP" });
    }

    const timeDiff = Math.abs(
      new Date().getTime() - teacher.tempOTP.createdAt.getTime()
    );
    const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    if (diffMinutes > 5) {
      return res.status(400).send({
        message: "OTP expired. Please resend OTP again",
      });
    }

    teacher.verified = true;
    teacher.tempOTP.otp = null;
    await teacher.save().then((savedUser) => {
      res.send({ message: "Teacher verified successfully" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.sendOTPTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      email: req.body.email,
    });

    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    // if (teacher.verified) {
    //   return res.status(400).send({ message: "Teacher already verified" });
    // }

    if (teacher.tempOTP.otp) {
      const timeDiff = Math.abs(
        new Date().getTime() - teacher.tempOTP.createdAt.getTime()
      );
      const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
      if (diffMinutes < 5) {
        res.status(400).send({
          message: "Mail already sent. Please try again after 5 minutes",
        });
        return;
      }
    }

    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    teacher.tempOTP.otp = bcrypt.hashSync(OTP, 8);
    teacher.tempOTP.createdAt = new Date();
    await teacher.save();

    const mailResp = await sendMail(
      teacher.email,
      "🔐 Quizzer Verification Key",
      OTP
    );

    if (mailResp === 400) {
      res.status(500).send({ message: "Error sending OTP" });
      return;
    } else {
      res.status(200).send({
        message: "Mail sent successfully. Please check your mail",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
};

exports.forgetPasswordTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (!teacher) {
      res.status(404).send({ message: "Teacher not found" });
      return;
    }

    if (!teacher.tempOTP.otp) {
      res.status(400).send({ message: "OTP not sent. Please send OTP first" });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.otp,
      teacher.tempOTP.otp
    );

    console.log(req.body.otp, teacher.tempOTP.otp);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid OTP" });
    }

    const timeDiff = Math.abs(
      new Date().getTime() - teacher.tempOTP.createdAt.getTime()
    );
    const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    if (diffMinutes > 5) {
      return res.status(400).send({
        message: "OTP expired. Please resend OTP again",
      });
    }

    teacher.tempOTP.otp = null;
    teacher.tempOTP.createdAt = null;
    teacher.password = bcrypt.hashSync(req.body.password, 8);
    await teacher.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.changePasswordTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.userId);
    if (!teacher) {
      res.status(404).send({ message: "Teacher not found" });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      teacher.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid old password" });
    }

    teacher.password = bcrypt.hashSync(req.body.newPassword, 8);
    await teacher.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};
