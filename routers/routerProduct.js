const exporess = require("express");
const {
  getProducts,
  postProducts,
  getPruductById,
  updateProducts,
  deleteProducat,
  upload,
  reProcessImages,
} = require("../services/productService");
const { createReviewByProductId } = require("../services/reviewService");

const router = exporess.Router();

const meddilewareCategorieError = require("./../middleware/categotieErrors");
const {
  createValdetorProduct,
  getValdetorProductById,
  updataValdetorProduct,
  deleteValdetorProduct,
  createReviewByproductIdValdetor,
} = require("../utils/valdiroeErrors/productValdetorError");
const { allowedTo, protect } = require("../services/authService");
const {
  getReviewsByProductId,
  getReviewOnproduct,
} = require("../services/reviewService");
const {
  getReviewByproductIdValdetor,
  getReviewByproductIdAndReviewIdValdetor,
} = require("../utils/valdiroeErrors/reviewValdetorError");

// Get all Reviews on productId
router
  .route("/:productId/review/:reviewId")
  .get(
    protect,
    allowedTo("user", "admin", "manger"),
    getReviewByproductIdAndReviewIdValdetor,
    meddilewareCategorieError,
    getReviewOnproduct
  );

router
  .route("/:productId/review")
  .get(
    protect,
    allowedTo("user", "admin", "manger"),
    getReviewByproductIdValdetor,
    meddilewareCategorieError,
    getReviewsByProductId
  )
  .post(
    protect,
    allowedTo("user"),
    createReviewByproductIdValdetor,
    meddilewareCategorieError,
    createReviewByProductId
  );

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manger"),
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    reProcessImages,
    createValdetorProduct,
    meddilewareCategorieError,
    postProducts
  );

router
  .route("/:id")
  .get(
    protect,
    allowedTo("admin", "manger", "user"),
    getValdetorProductById,
    meddilewareCategorieError,
    getPruductById
  )
  .put(
    protect,
    allowedTo("admin", "manger"),
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    reProcessImages,
    updataValdetorProduct,
    meddilewareCategorieError,
    updateProducts
  )
  .delete(
    protect,
    allowedTo("admin", "manger"),
    deleteValdetorProduct,
    meddilewareCategorieError,
    deleteProducat
  );

module.exports = router;
