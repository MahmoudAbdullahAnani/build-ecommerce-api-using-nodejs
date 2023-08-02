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
const router = exporess.Router({ mergeParams: true });

router
  .route("/")
  .post(
    // setCategoryIdInBody,
    createSubCategoryValdetor,
    meddilewareCategorieError,
    createSubCategory
  )
  .get(getSubCategory);

router
  .route("/:id")
  .get(
    getSubCategoryByIdValdetor,
    meddilewareCategorieError,
    getSubCategoryById
  )
  .put(
    updateSubCategoryByIdValdetor,
    meddilewareCategorieError,
    updateSubCategorie
  )
  .delete(
    deleteSubCategoryByIdValdetor,
    meddilewareCategorieError,
    deleteSubCategorie
  );

module.exports = router;
