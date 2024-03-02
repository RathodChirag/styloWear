const express = require("express");
const router = express.Router();

// Import your controllers
const AdminController = require("../controllers/adminController");

// Define Routes
router.post("/adminRegister", AdminController.registerAdmin);
router.post("/adminLogin", AdminController.loginAdmin);

module.exports = router;
