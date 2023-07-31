const { validationResult } = require("express-validator");

const meddilewareCategorieError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  next();
};
module.exports = meddilewareCategorieError;
