const express = require("express");
const router = express.Router();

const {
  addProductToCart,
  getCart,
  deleteProductInCart,
  clearProducts,
  updateCart,
  applyCoupon,
} = require("../services/cartService");

const meddilewareCategorieError = require("../middleware/categotieErrors");
const {
  deleteProductInCartValedatore,
  createProductInCartValedatore,
  updateProductInCartValedatore,
} = require("../utils/valdiroeErrors/cartValdetore");

const { protect, allowedTo } = require("../services/authService");

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    createProductInCartValedatore,
    meddilewareCategorieError,
    addProductToCart
  )
  .get(protect, allowedTo("user"), getCart)
  .delete(protect, allowedTo("user"), clearProducts);

// Apply Coupon
router.route("/coupon").put(protect, allowedTo("user"), applyCoupon);

router
  .route("/:productId")
  .delete(
    protect,
    allowedTo("user"),
    deleteProductInCartValedatore,
    meddilewareCategorieError,
    deleteProductInCart
  )
  .put(
    protect,
    allowedTo("user"),
    updateProductInCartValedatore,
    meddilewareCategorieError,
    updateCart
  );



module.exports = router;
