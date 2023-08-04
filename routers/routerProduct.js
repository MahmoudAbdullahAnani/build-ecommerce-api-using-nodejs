const exporess = require("express");
const {
  getProducts,
  postProducts,
  getPruductById,
  updateProducts,
  deleteProducat,
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
  .post(createValdetorProduct, meddilewareCategorieError, postProducts);

router
  .route("/:id")
  .get(getValdetorProductById, meddilewareCategorieError, getPruductById)
  .put(updataValdetorProduct, meddilewareCategorieError, updateProducts)
  .delete(deleteValdetorProduct, meddilewareCategorieError, deleteProducat);

module.exports = router;
