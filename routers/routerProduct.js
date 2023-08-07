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

router
  .route("/")
  .get(getProducts)
  .post(
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
  .get(getValdetorProductById, meddilewareCategorieError, getPruductById)
  .put(
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    reProcessImages,
    updataValdetorProduct,
    meddilewareCategorieError,
    updateProducts
  )
  .delete(deleteValdetorProduct, meddilewareCategorieError, deleteProducat);

module.exports = router;
