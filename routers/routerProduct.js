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
const app = express();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

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
      let filename = req.path.slice(1);

      console.log(filename)
      // try {
      //   let s3File = await s3
      //     .getObject({
      //       Bucket: process.env.BUCKET,
      //       Key: filename,
      //     })
      //     .promise();

      //   res.set("Content-type", s3File.ContentType);
      //   res.send(s3File.Body.toString()).end();
      // } catch (error) {
      //   if (error.code === "NoSuchKey") {
      //     console.log(`No such key ${filename}`);
      //     res.sendStatus(404).end();
      //   } else {
      //     console.log(error);
      //     res.sendStatus(500).end();
      //   }
      // }
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
