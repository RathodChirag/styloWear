const UserModel = require("../Model/userModel");

registerUser = async () => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;

    let user = await UserModel.find({ email });
    if (user) {
      return res.status(400).json({ message: "This user is already exist!" });
    }

    user = new UserModel({
      username,
      email,
      phone,
      password,
      confirmPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered succesfully", user });
  } catch (error) {
    console.log("Error while register user", error);
    res.status(400).json({ message: "Internal Server Error", user });
  }
};

module.exports = { registerUser };
