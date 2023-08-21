const { check, param } = require("express-validator");

const createProductInCartValedatore = [
  check("productId")
    .notEmpty()
    .withMessage("must add id product!")
    .isMongoId()
    .withMessage("not valid product id"),
  check("color")
    .notEmpty()
    .withMessage("must choose any color for this product"),
  check("quantity")
    .optional()
    .isInt()
    .withMessage("The number of pieces must be an integer"),
];

const deleteProductInCartValedatore = [
  param("productId")
    .notEmpty()
    .withMessage("product id must be reqiured")
    .isMongoId()
    .withMessage("invaled id"),
];

const updateProductInCartValedatore = [
  param("productId")
    .notEmpty()
    .withMessage("product id must be reqiured")
    .isMongoId()
    .withMessage("not valid this id"),
  check("color")
    .optional()
    .isString()
    .withMessage("The color should be in the form of text"),
  check("quantity")
    .optional()
    .isInt()
    .withMessage("The number of pieces must be an integer"),
];

module.exports = {
  deleteProductInCartValedatore,
  createProductInCartValedatore,
  updateProductInCartValedatore,
};
