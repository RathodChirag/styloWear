const express = require("express");
const mongoose = require("mongoose");
const ProductRating = require("../Model/productRatingModel");

addRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, review, rating } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    const productRating = new ProductRating({
      product: productId,
      user: userId,
      review,
      rating,
    });

    await productRating.save();

    res
      .status(201)
      .json({ message: "Product rating added successfully", productRating });
  } catch (error) {
    console.error("Error adding product rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

getRatingByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratingsByUser = await ProductRating.find({ user: userId }).populate({
      path: "product",
      select: "productName productPrice",
    });
    console.log(ratingsByUser);
    if (ratingsByUser.length === 0) {
      return res
        .status(400)
        .json({ message: "You have not rating/review any product!" });
    }
    res.status(200).json({ message: "User Rating and Reviews", ratingsByUser });
  } catch (error) {
    console.log("An error occurred while fetching ratings", error);
    res.status(500).json({ error: "An error occurred while fetching ratings" });
  }
};

getRatingByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const ratingsByProduct = await ProductRating.find({
      product: productId,
    }).populate({ path: "user", select: "username profilePhoto createdAt" });
    console.log(ratingsByProduct);
    if (ratingsByProduct.length === 0) {
      return res
        .status(400)
        .json({ message: "This Product has not any review/Rating!!" });
    }
    res
      .status(200)
      .json({ message: "Product Rating and Reviews", ratingsByProduct });
  } catch (error) {
    console.log(
      "An error occurred while fetching ratings usimg product Id",
      error
    );
    res.status(500).json({ error: "An error occurred while fetching ratings" });
  }
};

module.exports = { addRating, getRatingByUserId, getRatingByProductId };
