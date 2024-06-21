const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

// Import your controllers
const OrderController = require("../controllers/orderController");

// Define Routes for users order API
router.post("/user/placeUserOrder/:userId", OrderController.placeOrder);
router.get("/user/:orderId/orderDetail", OrderController.orderDetail);
router.post("/user/orderUpdateByUser/:orderId", OrderController.orderUpdateByUser);
router.put("/user/:orderId/orderCancel", OrderController.orderCancel);
router.get("/user/:userId/orders", OrderController.allOrdersListForUsers);


// Define Routes for Admin order API
router.get("/admin/orderList", OrderController.getAllOrderListForAdmin);
module.exports = router;
