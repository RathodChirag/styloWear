const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productItems: {
    type: [
      {
       product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      }     
    ],
    required: true,
  },
  // productItems: {
  //   type: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Product",
  //       required: true,
  //       quantity: { type: Number, required: true },
  //       price: { type: Number, required: true },
  //     },
  //   ],
  //   required: true,
  // },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} is not a valid total price!`,
    },
  },
  status: {
    type: String,
    enum: ["cancel","pending", "processing", "shipped", "delivered", "canceled"],
    default: "pending",
  },
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  additionalNotes: { type: String },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
