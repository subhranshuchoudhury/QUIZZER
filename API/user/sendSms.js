const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "subhransuchoudhury00@gmail.com",
    pass: "0Zc2YJzmh7bFUEHI",
  },
});

const sendMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: "' Quizzer <subhransuchoudhury00@gmail.com>'", // sender address
      to: "testsubhranshu00@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent:", info);
  } catch (error) {
    console.log(error);
  }
};

sendMail();

// console.log(
//   otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false })
// );
