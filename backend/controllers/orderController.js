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
      totalPrice, // Assign calculated totalPrice
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

getAllOrderListForAdmin = async(req,res) =>{
try {
  const orders = await OrderModel.find().populate('user').populate('productItems.product');
  res.status(200).json({orders})
} catch (error) {
  console.error("Error fetching orders for admin:", error);
    res.status(500).json({ error: "Failed to fetch orders for admin" });
}
}

module.exports = { placeOrder, getAllOrderListForAdmin };
