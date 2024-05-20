const express = require("express");
const mongoose = require("mongoose");
const ProductRating = require("../Model/productRatingModel");

addRating = async(req,res)=>{
    try {
        const {productId} = req.params;
        const {userId,review,rating}=req.body;

        if(!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({ error: "Invalid ObjectId" });
        }

        const productRating = new ProductRating({
            product:productId,
            user:userId,
            review,
            rating,
        });

        await productRating.save();

        res.status(201).json({ message: "Product rating added successfully" ,productRating});
    } catch (error) {
        console.error("Error adding product rating:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {addRating}