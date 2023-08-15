const express = require("express");
const router = express.Router();

const meddilewareCategorieError = require("../middleware/categotieErrors");

const { createAddresses, removeAddresses, getAddresses } = require("../services/addressesService");

const { allowedTo, protect } = require("../services/authService");

const {
  createAddressesValedator,
  removeAddressesValedator,
} = require("../utils/valdiroeErrors/addressesValedtoerError");


router
  .route("/")
  .post(
    protect,
    allowedTo("user", "admin", "manger"),
    createAddressesValedator,
    meddilewareCategorieError,
    createAddresses
  )
  .get(protect, allowedTo("user", "admin", "manger"), getAddresses);


router
  .route("/:addressId")
  .delete(
    protect,
    allowedTo("user", "admin", "manger"),
    removeAddressesValedator,
    meddilewareCategorieError,
    removeAddresses
  );

module.exports = router;
