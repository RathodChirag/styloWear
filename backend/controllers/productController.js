const ProductModel = require("../Model/productModel");

addProduct = async () => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productCategory,
      productSubCategory,
      productStock,
      productImages,
      productKeywords,
      productDiscount,
      productReviews,
    } = req.body();
  } catch (error) {}
};

module.exports = { addProduct };
