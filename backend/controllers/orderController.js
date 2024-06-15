const express = require("express");
const OrderModel = require("../Model/orderModel");
const ProductModel = require("../Model/productModel");

const placeOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      productItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      additionalNotes,
    } = req.body;
    const status = "pending";

    let totalPrice = 0;

    // Calculate totalPrice based on productItems
    for (const item of productItems) {
      const product = await ProductModel.findById(item.product);
      console.log("product", product);
      // console.log("product price", product.productOriginalPrice);
      if (product) {
        totalPrice += product.productOriginalPrice * item.quantity;

        //check if sufficient quantity is available
        if (item.quantity > product.productStock) {
          return res.status(400).json({
            error:
              `not enough stock available for product ${product.productName}`,
          });
        }

        // deduct order quantity from stock
        product.productStock -= item.quantity;

        await product.save();
      } else {
        return res
          .status(400)
          .json({ error: `Product with id ${item.product} not found` });
      }
    }

    // Create a new order document
    const order = new OrderModel({
      user: userId,
      productItems,
      orderDate: Date.now(),
      totalPrice,
      status,
      shippingAddress,
      billingAddress,
      paymentMethod,
      additionalNotes,
    });

    // Save the order document to the database
    await order.save();

    // Send a response indicating success
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    // Handle errors
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

getAllOrderListForAdmin = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user")
      .populate("productItems.product");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    res.status(500).json({ error: "Failed to fetch orders for admin" });
  }
};

// Order Address chnage api
orderUpdateByUser = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { shippingAddress, billingAddress } = req.body;

    // Define the fields to update
    const updateFields = {};
    if (shippingAddress) updateFields.shippingAddress = shippingAddress;
    if (billingAddress) updateFields.billingAddress = billingAddress;

    // Options for findByIdAndUpdate
    const options = {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    };

    // Find the order by orderId
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      updateFields,
      options
    );

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order status is "pending"
    if (order.status !== "pending") {
      return res.status(403).json({
        error: "Order cannot be updated because it is not in the pending state",
      });
    }

    // Send a response indicating success
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error while updating the order:", error);
    res.status(500).json({ error: "Failed to update the order" });
  }
};

module.exports = { placeOrder, getAllOrderListForAdmin, orderUpdateByUser };
