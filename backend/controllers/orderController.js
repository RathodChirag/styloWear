const express = require("express");
const OrderModel = require("../Model/orderModel");
const ProductModel = require("../Model/productModel");

// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const {
//       productItems,
//       shippingAddress,
//       billingAddress,
//       paymentMethod,
//       additionalNotes,
//     } = req.body;
//     const status = "pending";

//     let totalPrice = 0;
//     // for (const item of productItems.type) {
//     //   const product = await ProductModel.findById(item.type);
//     //   totalPrice += product.price * item.quantity;
//     // }

//     // Calculate totalPrice based on productItems
//     for (const item of productItems) {
//       const product = await ProductModel.findById(item.product);
//       if (product) {
//         totalPrice += product.price * item.quantity;
//       } else {
//         return res
//           .status(400)
//           .json({ error: `Product with id ${item.product} not found` });
//       }
//     }

//     // Create a new order document
//     const order = new OrderModel({
//       user: userId,
//       productItems,
//       orderDate: Date.now(),
//       totalPrice, // Assign calculated totalPrice
//       status,
//       shippingAddress,
//       billingAddress,
//       paymentMethod,
//       additionalNotes,
//     });

//     // Save the order document to the database
//     await order.save();

//     // Send a response indicating success
//     res.status(201).json({ message: "Order placed successfully!", order });
//   } catch (error) {
//     // Handle errors
//     console.error("Error placing order:", error);
//     res.status(500).json({ error: "Failed to place order" });
//   }
// };

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
      console.log("product price", product.productOriginalPrice);
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

module.exports = { placeOrder };
