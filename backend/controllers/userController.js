const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const { generateOtp, generateToken } = require("../utils/otpGenerator");
const { sendOTP } = require("../utils/mail");

registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;

    if (!username || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "This user is already exist!" });
    }

    user = new UserModel({
      username,
      email,
      phone,
      password,
    });

    //generate the token while register
    const token = await user.generateAuthToken();
    console.log("token while register: ", token);

    //Save the token in the cookies for Authentication
    res.cookie("JWT", token, { httpOnly: true });

    await user.save();

    res.status(201).json({ message: "User registered succesfully", user });
  } catch (error) {
    console.log("Error while register user", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const findAdmin = await UserModel.findOne({ email });

    if (findAdmin) {
      // compare the enter password with the hash password
      const isMatch = await bcrypt.compare(password, findAdmin.password);
      console.log("isMatch", isMatch);
      if (isMatch) {
        console.log("Login success");

        // generate the token while login
        const token = await findAdmin.generateAuthToken();
        console.log("token while login: ", token);

        //Save the token in the cookies for Authentication
        res.cookie("jwt", token, { httpOnly: true });

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
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = req.user;
    console.log("user in update", user);
    if (!user) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log("Old password does not match");
      return res.status(400).json({ message: "Old password does not match" });
    }

    user.password = req.body.newPassword;
    // user.password = hashedPassword;
    await user.save();
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
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate OTP And token to authenticate the user
    const otp = generateOtp();
    const token = generateToken();

    //Send the mail with OTP to users
    await sendOTP(email, otp);

    //hash the otp
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save the hashed OTP in the database for the admin
    user.otp = hashedOTP;
    user.token = token;
    await user.save();

    res.status(200).json({ message: "OTP sent successfully", user });
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
    const user = await UserModel.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User/Token not found" });
    }

    // Compare the entered OTP with the hashed OTP stored in the database
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (isMatch) {
      // OTP is verified, user is validated
      return res.status(200).json({ message: "OTP verified, user validated" });
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
    const user = await UserModel.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user/Token not found" });
    }

    user.password = newPassword;

    // Remove the reset token and OTP
    user.token = null;
    user.otp = null;

    await user.save();
    return res
      .status(201)
      .json({ message: "Your Password Reset Successfully !!" });
  } catch (error) {
    console.log("Error while Reset Password", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  verifyOTP,
  resetPassword
};
