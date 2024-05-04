const AdminModel = require("../Model/adminModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

const generateToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};

const sendVerificationEmail = async (findAdmin) => {
 
  try {
    const otp = generateOtp();
    const token = generateToken();

    findAdmin.otp = otp;
    findAdmin.token = token;

    await findAdmin.save();

    const tranporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "rathodchirag2907@gmail.com",
      to: `${findAdmin.email}`,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    tranporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.send('Error sending OTP. Please try again later.');
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
