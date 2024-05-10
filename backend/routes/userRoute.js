const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

//Import controllers
const UserController = require("../controllers/userController");

router.post("/userRegister", UserController.registerUser);
router.post("/userLogin", UserController.loginUser);
router.post("/userUpdatePassword", auth, UserController.updatePassword);

module.exports = router;
