const express = require("express");
const router = express.Router();

const {
  addSuppliers,
  updateSuppliers,
  deleteSuppliers,
  getSuppliers,
  getSupplier,
} = require("../services/suppliersServiece");

const { protect, allowedTo } = require("../services/authService");

// the route '/' on actions is Create (post) and get all (get).
router
  .route("/")
  .post(protect, allowedTo("admin", "manger"), addSuppliers)
  .get(getSuppliers);

// the route '/:reviewId' on actions is update (put) and delete (delete).
router
  .route("/:suppliersId")
  .get(protect, allowedTo("admin", "manger"), getSupplier)
  .put(protect, allowedTo("admin", "manger"), updateSuppliers)
  .delete(protect, allowedTo("admin", "manger"), deleteSuppliers);
module.exports = router;
