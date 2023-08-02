const exporess = require("express")
const router = exporess.Router()
const {
  getValdetorBrandById,
  updataValdetorBrand,
  deleteValdetorBrand,
  createValdetorBrand,
} = require("../utils/valdiroeErrors/brandValdetorError");
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand } = require("../services/brandService");
const meddilewareCategorieError = require("../middleware/categotieErrors");


router
  .route("/")
  .get(getBrands)
  .post(createValdetorBrand, meddilewareCategorieError, createBrand);


router
  .route("/:id")
  .get(getValdetorBrandById, meddilewareCategorieError, getBrand)
  .put(updataValdetorBrand, meddilewareCategorieError, updateBrand)
  .delete(deleteValdetorBrand, meddilewareCategorieError,deleteBrand);



module.exports = router