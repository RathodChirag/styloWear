const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

// Import your controllers
const OrderController = require("../controllers/orderController");

// Define Routes
router.post("/user/placeUserOrder/:userId", placeOrder.placeOrder);

module.exports = router;
