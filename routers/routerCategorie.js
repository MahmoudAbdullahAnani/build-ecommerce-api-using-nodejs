const exporess = require("express");
const router = exporess.Router();
const {
  postCategorie,
  getCategorie,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
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
  .post(createValdetorCategorie, meddilewareCategorieError, postCategorie)
  .get(getCategorie);
router
  .route("/:id")
  .get(getValdetorCategorieById, meddilewareCategorieError, getCategorieById)
  .put(updataValdetorCategorie, meddilewareCategorieError, updateCategorie)
  .delete(deleteValdetorCategorie, meddilewareCategorieError, deleteCategorie);

module.exports = router;
