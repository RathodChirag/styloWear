const ProductModel = require("../Model/productModel");
const upload = require("../utils/multerConfig");

// addProduct = async (req,res) => {
//   try {
//     const {
//       productName,
//       productDescription,
//       productPrice,
//       productCategory,
//       productSubCategory,
//       productStock,
//       productKeywords,
//       productDiscount,
//     } = req.body;

//       // Using upload middleware to handle file uploads
//       upload(req, res, async function (err) {
//         if (err) {
//           console.error("Error uploading files:", err);
//           return res.status(500).json({ error: "File upload failed" });
//         }})

//     const productImages = req.files.map((file) => file.path);

//     const newProduct = new ProductModel({
//       productName,
//       productDescription,
//       productPrice,
//       productCategory,
//       productSubCategory,
//       productStock,
//       productKeywords,
//       productDiscount,
//       productImages,
//     });

//     await newProduct.save();
//     res.status(201).json({ message: "Product added successfully" });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// addProduct = async (req, res) => {
//   try {
//     const {
//       productName,
//       productDescription,
//       productPrice,
//       productCategory,
//       productSubCategory,
//       productStock,
//       productKeywords,
//       productDiscount,
//     } = req.body;

//     // Using upload middleware to handle file uploads
//     upload(req, res, async function (err) {
//       if (err) {
//         console.error("Error uploading files:", err);
//         return res.status(500).json({ error: "File upload failed" });
//       }

//       try {
//         const productImages = req.files.map((file) => file.path);

//         const newProduct = new ProductModel({
//           productName,
//           productDescription,
//           productPrice,
//           productCategory,
//           productSubCategory,
//           productStock,
//           productKeywords,
//           productDiscount,
//           productImages,
//         });

//         await newProduct.save();
//         res.status(201).json({ message: "Product added successfully" });
//       } catch (error) {
//         console.error("Error adding product:", error);
//         res.status(500).json({ error: "Internal server error" });
//       }
//     });
//   } catch (error) {
//     console.error("Error parsing request body:", error);
//     res.status(400).json({ error: "Bad request" });
//   }
// };


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
        res.status(201).json({ message: "Product added successfully" });
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


module.exports = { addProduct };
