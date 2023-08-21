const { check, param } = require("express-validator");
const couponModule = require("../../modules/couponModule");
const apiError = require("../apiError");

const createCouponValedator = [
  check("name")
    .notEmpty()
    .withMessage("The Name Coupone Must Be Reqiured")
    .custom(async (name) => {
      const coupon = await couponModule.findOne({ name });
      if (coupon) {
        throw new apiError("This Coupen Already exists", 400);
      }
      return true;
    }),
  check("expirdate")
    .notEmpty()
    .withMessage("The Expir Time With Coupone Must Be Reqiured"),
  // .custom(async (expirdate, { req, res, next }) => {
  //   if (expirdate < new Date()) {
  //     throw next(
  //       new apiError("The offer end date must be in the future", 400)
  //     );
  //   }
  //   return true;
  // }),
  check("discount")
    .notEmpty()
    .withMessage("The Discount With Coupone Must Be Reqiured")
    .isLength({ min: 0 })
    .withMessage("The Discount It can't be less than zero")
    .isFloat()
    .withMessage("the discount Must be a number"),
];

const updateCouponValedator = [
  param("couponId")
    .notEmpty()
    .withMessage("The Coupon Id Must Be reqiured")
    .isMongoId()
    .withMessage("invaled this id"),
  check("name").notEmpty().withMessage("The Name Coupone Must Be Reqiured"),
  // .custom(async (name) => {
  //   const coupon = await couponModule.findOne({ name });
  //   if (coupon) {
  //     throw new apiError("This Coupen Already exists", 400);
  //   }
  //   return true;
  // }),
  check("expirdate")
    .notEmpty()
    .withMessage("The Expir Time With Coupone Must Be Reqiured")
    // .isDate()
    // .withMessage("This Date is Invaled")
    .custom(async (expirdate) => {
      if (expirdate < Date.now()) {
        throw new apiError("The offer end date must be in the future", 400);
      }
      return true;
    }),
  check("discount")
    .notEmpty()
    .withMessage("The Expir Time With Coupone Must Be Reqiured")
    .isLength({ min: 0 })
    .withMessage("The Discount It can't be less than zero")
    .isFloat()
    .withMessage("the discount Must be a number"),
];

const getCouponValedator = [
  param("couponId")
    .notEmpty()
    .withMessage("The Coupon Id Must Be reqiured")
    .isMongoId()
    .withMessage("invaled this id"),
];
const deleteCouponValedator = [
  param("couponId")
    .notEmpty()
    .withMessage("The Coupon Id Must Be reqiured")
    .isMongoId()
    .withMessage("invaled this id"),
];

module.exports = {
  createCouponValedator,
  getCouponValedator,
  updateCouponValedator,
  deleteCouponValedator,
};
