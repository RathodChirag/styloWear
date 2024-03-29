const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: null, 
  },
  profilePhoto: {
    type: String,
    default: null, 
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  updatedAt:{
    type:Date,
    default:Date.now
  }
});

// Hash the password before save the data
adminSchema.pre("save",async function (next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10);
    //console.log('Password Hash',this.password);
    next();
  }
})

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin
