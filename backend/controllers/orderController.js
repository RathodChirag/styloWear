const express = require("express");
const OrderModel = require("../Model/orderModel");
const ProductModel = require("../Model/productModel");


const placeOrder = async(req, res) => {
    try {
        const userId = req.params.userId;
        const { productItems, shippingAddress, billingAddress, paymentMethod, additionalNotes } = req.body;
        const status = pending;

        let totalPrice=0;
        for(const item of productItems){
            const product = await ProductModel.findById(item.product);
            totalPrice += product.price * item.quantity;
        }

         // Create a new order document
         const order = new Order({
            user: userId,
            productItems,
            orderDate: Date.now(),
            totalPrice, // Assign calculated totalPrice
            shippingAddress,
            billingAddress,
            paymentMethod,
            additionalNotes,
        });

        // Save the order document to the database
        await order.save();

          // Send a response indicating success
          res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (error) {
         // Handle errors
         console.error('Error placing order:', error);
         res.status(500).json({ error: 'Failed to place order' });
    }
};

module.exports = { placeOrder };
