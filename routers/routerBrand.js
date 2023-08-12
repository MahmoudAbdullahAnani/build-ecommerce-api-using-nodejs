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
const { protect, allowedTo } = require("../services/authService");


router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("admin", "manger"),
    createValdetorBrand,
    meddilewareCategorieError,
    upload.single("image"),
    imageBrandResize,
    createBrand
  );


router
  .route("/:id")
  .get(protect, allowedTo("admin", "manger","user"),getValdetorBrandById, meddilewareCategorieError, getBrand)
  .put(protect, allowedTo("admin", "manger"),updataValdetorBrand, meddilewareCategorieError, updateBrand)
  .delete(protect, allowedTo("admin", "manger"),deleteValdetorBrand, meddilewareCategorieError,deleteBrand);



module.exports = router