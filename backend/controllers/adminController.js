const AdminModel = require("../Model/adminModel");
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../utils/mail");

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
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
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

