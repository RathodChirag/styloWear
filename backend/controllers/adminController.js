const AdminModel = require("../Model/adminModel");
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../utils/mail");

registerAdmin = async (req, res) => {
  try {
    //console.log(req.body);
    const { username, email, password, confirmPassword } = req.body;

    let admin = await AdminModel.findOne({ email });

    if (admin) {
      return res.status(400).json({ error: "Admin Already exist!" });
    }

    admin = new AdminModel({
      username,
      email,
      password,
      confirmPassword,
    });

    //generate the token while register
    const token = await admin.generateAuthToken();
    console.log("token while register: ", token);

    await admin.save();

    res.status(201).json({ message: "Admin registered succesfully", admin });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
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
  console.log("in update password file");
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
  try {
    const { email } = req.body;
    console.log(req.body);

    const findAdmin = await AdminModel.findOne({ email });
    console.log(findAdmin);

    const token = await sendVerificationEmail(findAdmin);

    return res.status(200).json({ token, user: findAdmin });
  } catch (error) {
    console.log(error);
  }
};

verifyOtpandToken = async (req, res) => {
  try {
    const { otp, token } = req.body;
    const findAdmin = await AdminModel.findOne({ token });
    console.log(findAdmin);

    if (!findAdmin) {
      console.log(`Admin is not verified!!`);
      return res.status(404).json({ message: "Invalid Token" });
    }

    if (findAdmin.otp === otp) {
      // OTP matches, return success response
      return res.status(200).json({ message: "OTP and token are verified" });
    } else {
      // OTP does not match, return failure response
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  updatePassword,
  forgotPassword,
  verifyOtpandToken,
};
