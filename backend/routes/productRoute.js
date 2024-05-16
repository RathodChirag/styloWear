const express = require("express");
const router = express.Router();
// const auth = require("../utils/auth");

const ProductController = require("../controllers/productController");

router.post("/addProduct", ProductController.addProduct);

module.exports = router;
