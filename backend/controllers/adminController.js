const AdminModel = require("../Model/adminModel");
const bcrypt = require("bcrypt");

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

    const findAdmin = await AdminModel.findOne({ email });

    if (findAdmin) {
      // compare the enter password with the hash password
      const isMatch = await bcrypt.compare(password,findAdmin.password);
      console.log("isMatch", isMatch);
      if (isMatch) {
        console.log("Login success");
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

module.exports = { registerAdmin, loginAdmin };
