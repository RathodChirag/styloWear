const express = require("express");
const router = express.Router();
// const auth = require("../utils/auth");

const ProductRatingController = require("../controllers/productRatingController");

router.post("/ratings/:productId", ProductRatingController.addRating);
router.get(
  "/getRatingByUserId/:userId",
  ProductRatingController.getRatingByUserId
);
router.get(
  "/getRatingByProductId/:productId",
  ProductRatingController.getRatingByProductId
);

module.exports = router;
