const ProductModel = require("../Model/productModel");
const upload = require("../utils/multerConfig");
const mongoose = require("mongoose");

addProduct = async (req, res) => {
  try {
    // Call the upload middleware first to handle file uploads
    upload(req, res, async function (err) {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      try {
        // Now, access req.body and req.files after file upload is handled
        const {
          productName,
          productDescription,
          productOriginalPrice,
          productCategory,
          productSubCategory,
          productStock,
          productKeywords,
          productDiscount,
        } = req.body;

        if (
          !productName ||
          !productDescription ||
          !productOriginalPrice ||
          !productCategory ||
          !productSubCategory
        ) {
          return res.status(400).json({ error: "All fields are required" });
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          return res.status(400).json({ error: "No product images uploaded" });
        }

        // calculate the final price after discount
        const discount = productDiscount ? parseFloat(productDiscount) : 0;
        const OriginalPrice = parseFloat(productOriginalPrice);
        const productDiscountedPrice = OriginalPrice - (OriginalPrice * discount) / 100; 

        const productImages = req.files.map((file) => file.path);

        const newProduct = new ProductModel({
          productName,
          productDescription,
          productOriginalPrice,
          productDiscountedPrice,
          productCategory,
          productSubCategory,
          productStock,
          productKeywords,
          productDiscount,
          productImages,
        });

        await newProduct.save();
        res
          .status(201)
          .json({ message: "Product added successfully", newProduct });
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
    res.status(400).json({ error: "Bad request" });
  }
};

updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    upload(req, res, async function (err) {
      if (err) {
        console.error("error uploading files:", err);
        return res.status(500).json({ error: "file upload failed" });
      }

      const updates = req.body;

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        updates.productImages = req.files.map((file) => file.path);
      }

      try {
        const updateProduct = await ProductModel.findByIdAndUpdate(
          productId,
          updates,
          { new: true, runValidators: true }
        );

        if (!updateProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        res
          .status(200)
          .json({ message: "Product updated successfully", updateProduct });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
    res.status(400).json({ error: "Bad request" });
  }
};

deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("productID", productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(500).json({ message: "Invalid ProductId format!" });
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deleteProduct) {
      console.log("product is not deleted");
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deleteProduct,
    });
  } catch (error) {
    console.log("Error while delete product", error);
    return res.status(500).json("Internal Server Error");
  }
};

getAllProductList = async (req, res) => {
  try {
    const allProductList = await ProductModel.find();
    // If there are no products found, send a 404 response
    if (!allProductList || allProductList.length === 0) {
      return res.status(404).json({ message: "No Products found" });
    }

    // If products are found, send them as a response
    return res.status(200).json({ Products: allProductList });
  } catch (error) {
    console.log("Error while getAll Products", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addProduct,
  getAllProductList,
  updateProduct,
  deleteProduct,
};
