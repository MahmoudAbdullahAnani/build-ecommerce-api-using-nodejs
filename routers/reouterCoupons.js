const express = require("express");
const {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
} = require("../services/couponeService");
const { protect, allowedTo } = require("../services/authService");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const {
  createCouponValedator,
  updateCouponValedator,
  getCouponValedator,
  deleteCouponValedator,
} = require("../utils/valdiroeErrors/couponValedtoerError");
const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manger"),
    createCouponValedator,
    meddilewareCategorieError,
    createCoupon
  )
  .get(protect, allowedTo("admin", "manger"), getCoupons);

router
  .route("/:couponId")
  .put(
    protect,
    allowedTo("admin", "manger"),
    updateCouponValedator,
    meddilewareCategorieError,
    updateCoupon
  )
  .get(
    protect,
    allowedTo("admin", "manger"),
    getCouponValedator,
    meddilewareCategorieError,
    getCoupon
  )
  .delete(
    protect,
    allowedTo("admin", "manger"),
    deleteCouponValedator,
    meddilewareCategorieError,
    deleteCoupon
  );

module.exports = router;
