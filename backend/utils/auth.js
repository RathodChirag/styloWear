const jwt = require("jsonwebtoken");
const AdminModel = require("../Model/adminModel");
const UserModel = require("../Model/userModel");

const auth = async (req, res, next) => {
  let token;
  // Check if token is present in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verify token", verifyToken);

    // Check in AdminModel
    let user = await AdminModel.findById({ _id: verifyToken._id });

    // If no user found in AdminModel, check in UserModel
    if (!user) {
      user = await UserModel.findById({ _id: verifyToken._id });
    }

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    console.log("user", req.user);
    next();
    console.log("user authenticated successfully !!");
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth;
