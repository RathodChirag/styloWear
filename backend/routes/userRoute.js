const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

//Import controllers
const UserController = require("../controllers/userController");

router.post("/userRegister", UserController.registerUser);
router.post("/userLogin", UserController.loginUser);
router.post("/userUpdatePassword", auth, UserController.updatePassword);
router.post("/userForgotPassword", UserController.forgotPassword);
router.post("/verifyUserOtp", UserController.verifyOTP);
router.post("/userResetPassword", UserController.resetPassword);
router.get("/getAllProductForUser", UserController.getAllProductListForUser);
router.delete("/deleteUser/:id", auth, UserController.deleteUser);

module.exports = router;
