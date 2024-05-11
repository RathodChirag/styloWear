const AdminModel = require("../Model/adminModel");
const bcrypt = require("bcrypt");
const { generateOtp, generateToken } = require("../utils/otpGenerator");
const { sendOTP } = require("../utils/mail");

registerAdmin = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let admin = await AdminModel.findOne({ email });

    if (admin) {
      return res.status(400).json({ error: "Admin Already exist!" });
    }

    admin = new AdminModel({
      username,
      email,
      password,
    });

    //generate the token while register
    const token = await admin.generateAuthToken();
    console.log("token while register: ", token);

    //Save the token in the cookies for Authentication
    res.cookie("JWT", token, { httpOnly: true });

    await admin.save();

    res.status(201).json({ message: "Admin registered succesfully", admin });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const findAdmin = await AdminModel.findOne({ email });

    if (findAdmin) {
      // compare the enter password with the hash password
      console.log(findAdmin.password);
      const isMatch = await bcrypt.compare(password, findAdmin.password);
      console.log("isMatch", isMatch);
      if (isMatch) {
        console.log("Login success");

        // generate the token while login
        const token = await findAdmin.generateAuthToken();
        console.log("token while login: ", token);

        //Save the token in the cookies for Authentication
        res.cookie("JWT", token, { httpOnly: true });

        res.status(200).json({ message: "Admin login succesfully", findAdmin });
      } else {
        return res
          .status(400)
          .json({ error: "Email Id Or Password does not match!" });
      }
    } else {
      return res.status(400).json({ error: "Email does not exist!" });
    }
  } catch (error) {
    console.log("Error while login admin : ", error);
  }
};

updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin = req.user;
    console.log("admin in update", admin);

    if (!admin) {
      console.log("Admin not found!");
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      console.log("Old password does not match");
      return res.status(400).json({ message: "Old password does not match" });
    }

    admin.password = req.body.newPassword;
    // user.password = hashedPassword;
    await admin.save();
    console.log("Password updated");
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updating password:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // generate OTP And token to authenticate the admin
    const otp = generateOtp();
    console.log(otp);
    const token = generateToken();

    //Send the mail with OTP to admins
    await sendOTP(email, otp);

    //hash the otp
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save the hashed OTP in the database for the admin
    admin.otp = hashedOTP;
    admin.token = token;
    await admin.save();

    res.status(200).json({ message: "OTP sent successfully", admin });
  } catch (error) {
    console.error("Error in sending OTP:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  console.log("token", token);

  try {
    // Find the user by the token
    const admin = await AdminModel.findOne({ token });

    if (!admin) {
      return res.status(404).json({ message: "Admin/Token not found" });
    }

    // Compare the entered OTP with the hashed OTP stored in the database
    const isMatch = await bcrypt.compare(otp, admin.otp);

    if (isMatch) {
      // OTP is verified, user is validated
      return res.status(200).json({ message: "OTP verified, admin validated" });
    } else {
      // OTP is incorrect
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error in verifying OTP:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find the user by the token
    const admin = await AdminModel.findOne({ token });

    if (!admin) {
      return res.status(404).json({ message: "Admin/Token not found" });
    }

    admin.password = newPassword;

    // Remove the reset token and OTP
    admin.token = null;
    admin.otp = null;

    await admin.save();
    return res
      .status(201)
      .json({ message: "Your Password Reset Successfully !!" });
  } catch (error) {
    console.log("Error while Reset Password", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  updatePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
