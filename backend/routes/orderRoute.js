const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

// Import your controllers
const OrderController = require("../controllers/orderController");

// Define Routes
router.post("/placeUserOrder/:userId", OrderController.placeOrder);
router.get("/admin/orderList", OrderController.getAllOrderListForAdmin);

module.exports = router;
