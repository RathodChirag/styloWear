const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");

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

module.exports = { registerUser, loginUser, updatePassword };
