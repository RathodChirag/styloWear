const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendOTP(email, otp) {
  const mailOptions = {
    from: "process.env.EMAIL",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOTP };
