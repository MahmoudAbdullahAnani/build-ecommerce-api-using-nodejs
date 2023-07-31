const { check } = require("express-validator");

const getValdetorCategorieById = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const updataValdetorCategorie = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const deleteValdetorCategorie = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const createValdetorCategorie = [
  check("name")
    .notEmpty()
    .withMessage("the name is requred")
    .isLength({ min: 3 })
    .withMessage("this name is very short")
    .isLength({ max: 32 })
    .withMessage("this name is very long"),
];
module.exports = {
  getValdetorCategorieById,
  updataValdetorCategorie,
  deleteValdetorCategorie,
  createValdetorCategorie,
};
