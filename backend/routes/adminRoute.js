const express = require("express");
const router = express.Router();
const auth = require('../utils/auth');

// Import your controllers
const AdminController = require("../controllers/adminController");

// Define Routes
router.post("/adminRegister", AdminController.registerAdmin);
router.post("/adminLogin", AdminController.loginAdmin);
router.post("/adminResetPassword", auth, AdminController.updatePassword); 

module.exports = router;
