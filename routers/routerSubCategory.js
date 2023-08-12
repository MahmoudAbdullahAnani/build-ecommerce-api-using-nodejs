const exporess = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
  updateSubCategorie,
  deleteSubCategorie,
  // setCategoryIdInBody,
} = require("../services/subCategotyService");
const {
  createSubCategoryValdetor,
  getSubCategoryByIdValdetor,
  updateSubCategoryByIdValdetor,
  deleteSubCategoryByIdValdetor,
} = require("../utils/valdiroeErrors/subcategoryValdetorError");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const { protect, allowedTo } = require("../services/authService");
const router = exporess.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manger"),
    // setCategoryIdInBody,
    createSubCategoryValdetor,
    meddilewareCategorieError,
    createSubCategory
  )
  .get(protect, allowedTo("admin", "manger", "user"), getSubCategory);

router
  .route("/:id")
  .get(
    protect,
    allowedTo("admin", "manger", "user"),
    getSubCategoryByIdValdetor,
    meddilewareCategorieError,
    getSubCategoryById
  )
  .put(
    protect,
    allowedTo("admin", "manger"),
    updateSubCategoryByIdValdetor,
    meddilewareCategorieError,
    updateSubCategorie
  )
  .delete(
    protect,
    allowedTo("admin", "manger"),
    deleteSubCategoryByIdValdetor,
    meddilewareCategorieError,
    deleteSubCategorie
  );

module.exports = router;
