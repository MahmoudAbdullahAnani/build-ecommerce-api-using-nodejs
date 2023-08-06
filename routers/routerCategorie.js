const exporess = require("express");
const router = exporess.Router();
const multer = require("multer");
const {
  postCategorie,
  getCategorie,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
  upload,
  imageUpload,
} = require("../services/categorie");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const {
  getValdetorCategorieById,
  updataValdetorCategorie,
  deleteValdetorCategorie,
  createValdetorCategorie,
} = require("../utils/valdiroeErrors/categorieValdetorError");
const {
  getSubCategory,
  createSubCategory,
} = require("../services/subCategotyService");

router
  .route("/:categoryId/subcategory")
  .get(getSubCategory)
  .post(createSubCategory);

// @desc handel all ruots category
router
  .route("/")
  .post(
    upload.single("image"),
    imageUpload,
    createValdetorCategorie,
    meddilewareCategorieError,
    postCategorie
  )
  .get(getCategorie);
router
  .route("/:id")
  .get(getValdetorCategorieById, meddilewareCategorieError, getCategorieById)
  .put(
    upload.single("image"),
    imageUpload,
    updataValdetorCategorie,
    meddilewareCategorieError,
    updateCategorie
  )
  .delete(deleteValdetorCategorie, meddilewareCategorieError, deleteCategorie);

module.exports = router;
