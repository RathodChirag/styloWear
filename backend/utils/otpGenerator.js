const crypto = require("crypto");

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  return otp;
};

const generateToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};

module.exports = { generateOtp, generateToken };
