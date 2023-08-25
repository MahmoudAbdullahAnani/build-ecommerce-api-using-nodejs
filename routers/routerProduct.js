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
  // Handling Error Upload file
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

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
    async (req, res) => {
      // store something
      await s3
        .putObject({
          Body: JSON.stringify({ key: "value" }),
          Bucket: "cyclic-fuzzy-lion-singlet-eu-west-3",
          Key: "some_files/my_file.json",
        })
        .promise();

      // get it back
      let my_file = await s3
        .getObject({
          Bucket: "cyclic-fuzzy-lion-singlet-eu-west-3",
          Key: "some_files/my_file.json",
        })
        .promise();

      console.log('my_file',JSON.parse(my_file));
    },
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
