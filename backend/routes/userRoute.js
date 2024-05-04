const express = require("express");
const router = express.Router();

//Import controllers
const UserController = require("../controllers/userController");

router.post("/userRegister", UserController.registerUser);

module.exports = router;
