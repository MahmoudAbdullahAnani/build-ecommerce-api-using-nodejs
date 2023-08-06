const exporess = require("express")
const router = exporess.Router()
const {
  getValdetorBrandById,
  updataValdetorBrand,
  deleteValdetorBrand,
  createValdetorBrand,
} = require("../utils/valdiroeErrors/brandValdetorError");
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand, imageBrandResize } = require("../services/brandService");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const { upload } = require("../services/categorie");


router
  .route("/")
  .get(getBrands)
  .post(
    createValdetorBrand,
    meddilewareCategorieError,
    upload.single("image"),
    imageBrandResize,
    createBrand
  );


router
  .route("/:id")
  .get(getValdetorBrandById, meddilewareCategorieError, getBrand)
  .put(updataValdetorBrand, meddilewareCategorieError, updateBrand)
  .delete(deleteValdetorBrand, meddilewareCategorieError,deleteBrand);



module.exports = router