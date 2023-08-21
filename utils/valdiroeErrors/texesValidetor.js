const { check } = require("express-validator");

const createOrUpdateTexesValditor = [
  check("texPrice")
    .notEmpty()
    .withMessage("texes Price must be required")
    .isFloat()
    .withMessage("texes Price must type a number"),
  check("shippingPrice")
    .notEmpty()
    .withMessage("texes Price must be required")
    .isFloat()
    .withMessage("texes Price must type a number"),
];

module.exports = {
  createOrUpdateTexesValditor,
};