const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  otp: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//generate the auth token
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    console.log("error while generate token", error);
  }
};

// Hash the password before save the data
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    //console.log('Password Hash',this.password);
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
