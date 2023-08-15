const { check } = require("express-validator");

const productsModule = require("../../modules/productsModule");
const ReviewModule = require("../../modules/reviewModeule");

const createReviewValdetor = [
  check("reviewText")
    .optional()
    .isLength({ min: 3 })
    .withMessage("There is text review is very short"),
  check("rating")
    .notEmpty()
    .withMessage("the rating must be required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("the rating must be between 1 to 5"),
  check("product")
    .notEmpty()
    .withMessage("the id product must be required")
    .isMongoId()
    .withMessage(`this Id product is not valide`)
    .custom(async (productId, { req }) => {
      const product = await productsModule.findById(productId);
      //   check if product in data base
      if (!product) {
        throw new Error("This product is not found");
      }
      // check if this user after review on this product
      // 1) get reivew by userId and productId
      const review = await ReviewModule.findOne({
        user: req.user._id,
        product: productId,
      });
      if (review) {
        throw new Error("You can't tow reviews on this product");
      }
      return true;
    }),
];

const getReviewValdetor = [
  check("reviewId").notEmpty().withMessage("The id must be required"),
];
const updateReviewValdetor = [
  check("reviewId").notEmpty().withMessage("The id must be required"),
  check("reviewText")
    .optional()
    .isLength({ min: 3 })
    .withMessage("There is text review is very short"),
  check("rating")
    .notEmpty()
    .withMessage("the rating must be required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("the rating must be between 1 to 5")
    .custom(async (val, { req }) => {
      //  1) get userId
      const userId = req.user._id;
      //  2) get review
      const review = await ReviewModule.findById(req.params.reviewId);
      //  3) check if this user after review on this product
      if (review?.user.toString() !== userId.toString()) {
        throw new Error("You can't update this review on this product");
      }
      return true;
    }),
];
const deleteReviewValdetor = [
  check("reviewId")
    .notEmpty()
    .withMessage("The id must be required")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        //  1) get userId
        const userId = req.user._id;
        //  2) get review
        const review = await ReviewModule.findById(req.params.reviewId);
        //  3) check if this user after review on this product
        if (review?.user.toString() !== userId.toString()) {
          throw new Error("You can't delete this review on this product");
        }
        return true;
      }
      return true;
    }),
];

const getReviewByproductIdValdetor = [
  check("productId")
    .notEmpty()
    .withMessage("id product must be required")
    .isMongoId()
    .withMessage("this id is invaled "),
];

const getReviewByproductIdAndReviewIdValdetor = [
  check("productId")
    .notEmpty()
    .withMessage("the product id must be reqiured")
    .isMongoId()
    .withMessage("this invalid id"),
  check("reviewId")
    .notEmpty()
    .withMessage("the review id must be reqiured")
    .isMongoId()
    .withMessage("this invalid id"),
];

module.exports = {
  createReviewValdetor,
  getReviewValdetor,
  updateReviewValdetor,
  deleteReviewValdetor,
  getReviewByproductIdValdetor,
  getReviewByproductIdAndReviewIdValdetor,
};
