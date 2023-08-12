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
const { protect, allowedTo } = require("../services/authService");

router
  .route("/:categoryId/subcategory")
  .get(getSubCategory)
  .post(createSubCategory);

// @desc handel all ruots category
router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manger"),
    (req, res, next) => {
      if (req.body.image) upload.single("image"), imageUpload;
      next();
    },
    createValdetorCategorie,
    meddilewareCategorieError,
    postCategorie
  )
  .get(protect, allowedTo("admin", "manger","user"), getCategorie);
router
  .route("/:id")
  .get(
    protect,
    allowedTo("admin", "manger", "user"),
    getValdetorCategorieById,
    meddilewareCategorieError,
    getCategorieById
  )
  .put(
    protect,
    allowedTo("admin", "manger"),
    upload.single("image"),
    imageUpload,
    updataValdetorCategorie,
    meddilewareCategorieError,
    updateCategorie
  )
  .delete(
    protect,
    allowedTo("admin", "manger"),
    deleteValdetorCategorie,
    meddilewareCategorieError,
    deleteCategorie
  );

module.exports = router;
