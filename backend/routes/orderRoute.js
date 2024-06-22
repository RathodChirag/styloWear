const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

// Import your controllers
const OrderController = require("../controllers/orderController");

// Define Routes for users order API
router.post("/user/placeUserOrder/:userId", OrderController.placeOrder);
router.get("/user/:orderId/orderDetail", OrderController.orderDetail);
router.get("/user/:userId/orders", OrderController.allOrdersListForUsers);
router.get("/user/:orderId/trackOrder", OrderController.trackOrder);
router.post("/user/orderUpdateByUser/:orderId", OrderController.orderUpdateByUser);
router.put("/user/:orderId/orderCancel", OrderController.orderCancel);

// Define Routes for Admin order API
router.get("/admin/orderList", OrderController.getAllOrderListForAdmin);
router.get("/admin/:orderId/orderDetail", OrderController.orderDetail);
router.patch("/admin/:orderId/updateStatus", OrderController.updateUserOrderStatus);

module.exports = router;
