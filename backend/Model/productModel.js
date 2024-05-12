const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productSubCategory: {
    type: String,
    required: true,
  },
  productStock: {
    quantity: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    outOfStock: { type: Boolean, default: false },
  },
  productImages: [{ type: String }],
  productKeywords: [{ type: String }],
  productDiscount: {
    type: Number,
    default: 0,
  },
  productReviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 },
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
