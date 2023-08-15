const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const apiError = require("../utils/apiError");
const reviewModeule = require("../modules/reviewModeule");

// @desc      Get All Reviews
// @Route     GET /api/v1/reviews
// @access    Public/Admin-manger
const getReviews = expressAsyncHandler(async (req, res, next) => {
  const { limit } = req.query || 5;
  const reviews = await reviewModeule
    .find({})
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
  const review = await reviewModeule
    .findById(req.params.reviewId)
    .populate({ path: "user", select: "name phone email role password" })
    .populate({
      path: "product",
      select:
        "title description quantity sold price priceAfterDiscount imageCover ratingsQuantity ratingsAverage subCategory brand",
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
  const review = await reviewModeule.create(dataReview);
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
  const review = await reviewModeule.findByIdAndUpdate(reviewId, req.body, {
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
  const review = await reviewModeule.findByIdAndDelete(reviewId);
  const data = {
    message: "Success",
    error: null,
    data_deleted: review,
  };
  review
    ? res.status(200).json(data)
    : next(new apiError("invalid review id", 404));
});

// Nested Routes

// @desc      Get Reivews on prudect by productId
// @Route     GET /api/v1/products/:productId/review
// @access    public/user-admin-manger
const getReviewsByProductId = expressAsyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const review = await reviewModeule
    .find({ product: productId })
    .populate({ path: "user",select:"name phone email _id" })
    .select("-__v");
  const data = {
    message: "Success",
    error: null,
    data: review,
  };
  review
    ? res.status(200).json(data)
    : res.status(404).json({ message: "not found", error: true });
});

// @desc      Create Reivew on prudect by productId
// @Route     POST /api/v1/products/:productId/review
// @access    public/user
const createReviewByProductId = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const encoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const { userId } = encoded;
  const { productId } = req.params;
  const { reviewText, rating } = req.body;
  const dataInsert = {
    reviewText,
    rating,
    product: productId,
    user: userId,
  };
  const review = await reviewModeule.create(dataInsert);
  const data = {
    message: "Success",
    error: null,
    data: review,
  };
  res.status(201).json(data);
});

// @desc      Get Reivew on prudect by productId and reviewId
// @Route     GET /api/v1/products/:productId/review/:reviewId
// @access    public/user-admin-manger
const getReviewOnproduct = expressAsyncHandler(async (req, res, next) => {
  const { productId, reviewId } = req.params;
  const buildReivew = reviewModeule.find({ _id: reviewId, product: productId });
  buildReivew.select("-__v");
  const review = await buildReivew;
  const data = {
    message: "Success",
    error: null,
    data: review[0],
  };
  review.length < 1 && review.length === 0
    ? res.status(404).json({ message: "not found review" })
    : res.status(200).json(data);
});

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProductId,
  createReviewByProductId,
  getReviewOnproduct,
};
