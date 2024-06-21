const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

// Import your controllers
const OrderController = require("../controllers/orderController");

// Define Routes
router.post("/user/placeUserOrder/:userId", OrderController.placeOrder);
router.get("/admin/orderList", OrderController.getAllOrderListForAdmin);
router.post("/user/orderUpdateByUser/:orderId", OrderController.orderUpdateByUser);
router.put("/user/:orderId/orderCancel", OrderController.orderCancel);

module.exports = router;
