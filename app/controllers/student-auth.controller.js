const config = require("../config/auth.config");
const db = require("../models");
const Student = db.student;
const Role = db.role;
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const axios = require("axios");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.studentRegister = async (req, res) => {

  const { regdNo, password } = req.body;

  const loginOptions = {
    method: "POST",
    url: `${process.env.CAMPUS_PORTAL_URL}/login`,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    data: `{"username":"${regdNo}" ,"password":"${password}","MemberType":"s"}`,
  };

  try {

    const response = await axios(loginOptions);

    const data = response?.data;

    if (data?.status === "success") {

      const studentInfoOptions = {
        method: "POST",
        url: `${process.env.CAMPUS_PORTAL_URL}/studentinfo`,
        headers: {
          Cookie: response?.headers?.["set-cookie"]?.[0],
        },
      };

      const studentInfoResponse = await axios(studentInfoOptions);
      if (studentInfoResponse?.status === 200) {
        console.log(studentInfoResponse?.data?.detail?.[0]);
        const { enrollmentno, sectioncode, academicyear,stynumber, gender, scellno, dateofbirth, name, pcellno, semailid, branchdesc } = studentInfoResponse?.data?.detail?.[0];
        const student = new Student({
          name,
          email: semailid,
          regdNo: enrollmentno,
          password: bcrypt.hashSync(password, 8),
          section: sectioncode,
          branch: branchdesc,
          semester: stynumber,
          admissionYear: academicyear,
          gender: gender,
          verified: true,
          allowed: true,
          phone: scellno,
          primaryPhone: scellno,
          secondaryPhone: pcellno,
          dateOfBirth: dateofbirth,
        })

        try {
          const roles = await Role.find({
            name: { $in: "user" },
          });
          student.roles = roles.map((role) => role._id);
          student.save().then((user) => {
            res.send({ message: "Account registered successfully" });
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "Server error" });
          return;
        }
      }




    } else if (data?.status === "error") {

      return res.status(401).send({ message: "Invalid Credentials" });
    }

  } catch (error) {

    console.log(error);
    return res.status(401).send({ message: "Server error" });

  }

};


exports.studentLogin = async (req, res) => {
  const { regdNo, password } = req.body;
  try {
    const student = await Student.findOne({
      regdNo,
    }).populate("roles", "-__v");

    if (student) {
      const passwordIsValid = bcrypt.compareSync(password, student.password);

      if (!student.verified) {
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

      const token = jwt.sign({ id: student.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < student.roles.length; i++) {
        authorities.push("ROLE_" + student.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        name: student.name,
        email: student.email,
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
