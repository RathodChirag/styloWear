const ProductModel = require("../Model/productModel");
const upload = require("../utils/multerConfig");

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
          productPrice,
          productCategory,
          productSubCategory,
          productStock,
          productKeywords,
          productDiscount,
        } = req.body;

        if (
          !productName ||
          !productDescription ||
          !productPrice ||
          !productCategory ||
          !productSubCategory
        ) {
          return res.status(400).json({ error: "All fields are required" });
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          return res.status(400).json({ error: "No product images uploaded" });
        }

        const productImages = req.files.map((file) => file.path);

        const newProduct = new ProductModel({
          productName,
          productDescription,
          productPrice,
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

// const updateProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     upload(req, res, async function (err) {
//       if (err) {
//         console.error("Error uploading files:", err);
//         return res.status(500).json({ error: "File upload failed" });
//       }

//       const updates = req.body;
//       if (req.files && Array.isArray(req.files) && req.files.length > 0) {
//         updates.productImages = req.files.map((file) => file.path);
//       }

//       try {
//         const updatedProduct = await ProductModel.findByIdAndUpdate(
//           productId,
//           updates,
//           { new: true, runValidators: true }
//         );

//         if (!updatedProduct) {
//           return res.status(404).json({ message: "Product not found" });
//         }

//         res
//           .status(200)
//           .json({ message: "Product updated successfully", updatedProduct });
//       } catch (error) {
//         console.error("Error updating product:", error);
//         res.status(500).json({ error: "Internal server error" });
//       }
//     });
//   } catch (error) {
//     console.error("Error parsing request body:", error);
//     res.status(400).json({ error: "Bad request" });
//   }
// };

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

module.exports = { addProduct, getAllProductList, updateProduct };
