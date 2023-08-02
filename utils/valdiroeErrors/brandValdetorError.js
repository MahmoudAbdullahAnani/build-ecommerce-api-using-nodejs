const { check } = require("express-validator");

const getValdetorBrandById = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const updataValdetorBrand = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const deleteValdetorBrand = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const createValdetorBrand = [
  check("name")
    .notEmpty()
    .withMessage("the name is requred")
    .isLength({ min: 3 })
    .withMessage("this name is very short")
    .isLength({ max: 32 })
    .withMessage("this name is very long"),
];
module.exports = {
  getValdetorBrandById,
  updataValdetorBrand,
  deleteValdetorBrand,
  createValdetorBrand,
};
