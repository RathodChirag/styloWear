const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

const ProductController = require("../controllers/productController");

router.post("/addProduct", auth, ProductController.addProduct);
router.get("/getAllProduct", auth, ProductController.getAllProductList);
router.put("/updateProduct/:id", auth, ProductController.updateProduct);
router.delete("/deleteProduct/:id", auth, ProductController.deleteProduct);

module.exports = router;



