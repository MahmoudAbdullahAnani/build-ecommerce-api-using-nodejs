const express = require("express");
const router = express.Router();

const {
  getReqProducts,
  deleteReqProduct,
  addReqProduct,
  getReqProduct,
} = require("../services/reqProductService");

const { protect, allowedTo } = require("../services/authService");

// the route '/' on actions is Create (post) and get all (get).
//protect, allowedTo("user"), addReqProduct
router
  .route("/")
  .post(protect, allowedTo("user"), addReqProduct)
  .get(protect, allowedTo("admin", "manger"), getReqProducts);
// the route '/:reviewId' on actions is update (put) and delete (delete).
router
  .route("/:reqProduct")
  .delete(protect, allowedTo("admin", "manger"), deleteReqProduct)
  .get(protect, allowedTo("admin", "manger"), getReqProduct);
module.exports = router;
