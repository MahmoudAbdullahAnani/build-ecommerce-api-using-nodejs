const express = require("express");
const { getTexes, createOrUpdateTexes } = require("../services/texesService");
const { protect, allowedTo } = require("../services/authService");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const {
  createOrUpdateTexesValditor,
} = require("../utils/valdiroeErrors/texesValidetor");
const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manger"),
    createOrUpdateTexesValditor,
    meddilewareCategorieError,
    createOrUpdateTexes
  )
  .get(protect, allowedTo("admin", "manger"), getTexes);

module.exports = router;
