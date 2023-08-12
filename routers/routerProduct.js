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
const router = exporess.Router();

const meddilewareCategorieError = require("./../middleware/categotieErrors");
const {
  createValdetorProduct,
  getValdetorProductById,
  updataValdetorProduct,
  deleteValdetorProduct,
} = require("../utils/valdiroeErrors/productValdetorError");
const { allowedTo, protect } = require("../services/authService");

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
