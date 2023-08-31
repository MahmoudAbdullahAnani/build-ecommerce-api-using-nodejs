const express = require("express");
const router = express.Router();

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewByProductId,
} = require("../services/reviewService");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const {
  createReviewValdetor,
  getReviewValdetor,
  updateReviewValdetor,
  deleteReviewValdetor,
} = require("../utils/valdiroeErrors/reviewValdetorError");

const { protect, allowedTo } = require("../services/authService");

// the route '/' on actions is Create (post) and get all (get).
router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    createReviewValdetor,
    meddilewareCategorieError,
    createReview
  )
  .get(getReviews);
// the route '/:reviewId' on actions is update (put) and delete (delete).
router
  .route("/:reviewId")
  .get(
    protect,
    allowedTo("user", "admin", "manger"),
    getReviewValdetor,
    meddilewareCategorieError,
    getReview
  )
  .put(
    protect,
    allowedTo("user"),
    updateReviewValdetor,
    meddilewareCategorieError,
    updateReview
  )
  .delete(
    protect,
    allowedTo("user", "admin", "manger"),
    deleteReviewValdetor,
    meddilewareCategorieError,
    deleteReview
  );
module.exports = router;
