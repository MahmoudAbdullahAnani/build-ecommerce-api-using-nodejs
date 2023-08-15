const express = require("express");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const router = express.Router();

const {
  createWishlist,
  removeWishlist,
  getMyWishlist,
} = require("../services/wishlistService");
const { protect, allowedTo } = require("../services/authService");
const {
  createWishlistValedator,
  removeWishlistValedator,
} = require("../utils/valdiroeErrors/wishlistValedator");

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    createWishlistValedator,
    meddilewareCategorieError,
    createWishlist
  )
  .get(protect, allowedTo("user"), getMyWishlist);
router
  .route("/:productId")
  .delete(
    protect,
    allowedTo("user"),
    removeWishlistValedator,
    meddilewareCategorieError,
    removeWishlist
  );
module.exports = router;
