const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

// Import your controllers
const AdminController = require("../controllers/adminController");

// Define Routes
router.post("/adminRegister", AdminController.registerAdmin);
router.post("/adminLogin", AdminController.loginAdmin);
router.post("/adminUpdatePassword", auth, AdminController.updatePassword);
router.post("/adminForgotPassword", AdminController.forgotPassword);
router.post("/verifyAdminOtp", AdminController.verifyOTP);
router.post("/adminResetPassword", AdminController.resetPassword);
router.get("/getAllUser", auth, AdminController.getAllUsers);

module.exports = router;
