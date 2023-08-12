const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Review = require("../modules/reviewModeule");
const apiError = require("../utils/apiError");

// @desc      Get All Reviews
// @Route     GET /api/v1/reviews
// @access    Public/Admin-manger
const getReviews = expressAsyncHandler(async (req, res, next) => {
  const { limit } = req.query || 5;
  const reviews = await Review.find({})
    .limit(limit)
    .populate({ path: "user", select: "name phone email role password" })
    .populate({
      path: "product",
      select:
        "title description quantity sold price priceAfterDiscount imageCover ratingsQuantity ratingsAverage subCategory brand",
    });
  const data = {
    message: "Success",
    error: null,
    data: reviews,
  };
  res.status(200).json(data);
});

// @desc      Get Review
// @Route     GET /api/v1/reviews/:reviewId
// @access    Public/Admin-manger-userCreated
const getReview = expressAsyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  const data = {
    message: "Success",
    error: null,
    data: review,
  };
  review
    ? res.status(200).json(data)
    : next(new apiError("invalid review id", 404));
});

// @desc      Create Review
// @Route     POST /api/v1/reviews
// @access    public/user
const createReview = expressAsyncHandler(async (req, res, next) => {
  // get token
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const { userId } = user;
  // check any error for data in valleditor
  const { reviewText, rating, product } = req.body;
  const dataReview = {
    reviewText,
    rating,
    user: userId,
    product,
  };
  const review = await Review.create(dataReview);
  const data = {
    message: "Success",
    error: null,
    data: review,
  };
  res.status(201).json(data);
});

// @desc      Update Reivew
// @Route     PUT /api/v1/reviews/:reviewId
// @access    Private/userCreated
const updateReview = expressAsyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
  });
  const data = {
    message: "Success",
    error: null,
    data: review,
  };
  review
    ? res.status(200).json(data)
    : next(new apiError("invalid review id", 404));
});

// @desc      Delte Reivew
// @Route     DELETE /api/v1/reviews/:reviewId
// @access    Private
const deleteReview = expressAsyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findByIdAndDelete(reviewId);
  const data = {
    message: "Success",
    error: null,
    data_deleted: review,
  };
  review
    ? res.status(200).json(data)
    : next(new apiError("invalid review id", 404));
});

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
