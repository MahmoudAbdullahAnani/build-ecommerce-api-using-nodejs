const { check } = require("express-validator");

const createSubCategoryValdetor = [
  check("name")
    .notEmpty()
    .withMessage("the name is must be required")
    .isLength({ min: 3 })
    .withMessage("this name is very short")
    .isLength({ max: 200 })
    .withMessage("this name is very long"),
  check("categori")
    .notEmpty()
    .withMessage("the categori id is must be requred")
    .isMongoId()
    .withMessage("this id not valid"),
];

const getSubCategoryByIdValdetor = [
  check("id")
    .notEmpty()
    .withMessage("the is must be requred")
    .isMongoId()
    .withMessage("this id not valid"),
];
const updateSubCategoryByIdValdetor = [
  check("id")
    .notEmpty()
    .withMessage("the is must be requred")
    .isMongoId()
    .withMessage("this id not valid"),
];
const deleteSubCategoryByIdValdetor = [
  check("id")
    .notEmpty()
    .withMessage("the is must be requred")
    .isMongoId()
    .withMessage("this id not valid"),
];
module.exports = {
  createSubCategoryValdetor,
  getSubCategoryByIdValdetor,
  updateSubCategoryByIdValdetor,
  deleteSubCategoryByIdValdetor,
};
