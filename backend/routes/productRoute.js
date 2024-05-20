const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

const ProductController = require("../controllers/productController");
const ProductRatingController = require("../controllers/productRatingController");

router.post("/addProduct", auth, ProductController.addProduct);
router.get("/getAllProduct", auth, ProductController.getAllProductList);
router.put("/updateProduct/:id", auth, ProductController.updateProduct);
router.delete("/deleteProduct/:id", auth, ProductController.deleteProduct);


router.post("/:productId/ratings",ProductRatingController.addRating);
module.exports = router;



