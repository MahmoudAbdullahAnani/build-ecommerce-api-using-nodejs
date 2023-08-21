// CRUD For Coupons

const expressAsyncHandler = require("express-async-handler");
const couponModule = require("../modules/couponModule");

// @desc    Create Coupon
// @Router  POST api/v1/coupons
// @acces   Private/Admin-manger
const createCoupon = expressAsyncHandler(async (req, res, next) => {
  const { name, expirdate, discount } = req.body;
  const date = new Date(expirdate);
  const expirdateMilliseconds = date.getTime();
  const coupon = await couponModule.create({
    name,
    expirdate: expirdateMilliseconds,
    discount,
  });
  res.status(200).json({ message: "Inserted Coupon.", data: coupon });
});

// @desc    Get All Coupons
// @Router  GET api/v1/coupons
// @acces   Private/Admin-manger
const getCoupons = expressAsyncHandler(async (req, res, next) => {
  const coupons = await couponModule.find({}).select("-__v");
  res
    .status(200)
    .json({ message: "All Coupons.", count: coupons.length, data: coupons });
});

// @desc    Get Coupon
// @Router  GET api/v1/coupons/:couponId
// @acces   Private/Admin-manger
const getCoupon = expressAsyncHandler(async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await couponModule.findById(couponId).select("-__v -_id");
  coupon
    ? res.status(200).json({ message: "Your Coupon.", data: coupon })
    : res
        .status(200)
        .json({ message: `Not Found Coupon on This Id (${couponId}).` });
});

// @desc    Updata Coupon
// @Router  PUT api/v1/coupons/:couponId
// @acces   Private/Admin-manger
const updateCoupon = expressAsyncHandler(async (req, res, next) => {
  const { couponId } = req.params;
  if (req.body.expirdate) {
    const date = new Date(`${req.body.expirdate}`);
    const expirdateMilliseconds = date.getTime();
    req.body.expirdate = expirdateMilliseconds;
    console.log("date", date);
    console.log("expirdateMilliseconds", expirdateMilliseconds);
    console.log("req.body.expirdate", req.body.expirdate);
    // console.log('',)
  }
  const coupon = await couponModule
    .findByIdAndUpdate(couponId, req.body, {
      new: true,
    })
    .select("-__v");
  coupon
    ? res.status(200).json({ message: "Updated Your Coupon.", data: coupon })
    : res
        .status(200)
        .json({ message: `Not Found Coupon on This Id (${couponId}).` });
});

// @desc    Delete Coupon
// @Router  DELETE api/v1/coupons/:couponId
// @acces   Private/Admin-manger
const deleteCoupon = expressAsyncHandler(async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await couponModule.findByIdAndDelete(couponId);
  coupon
    ? res
        .status(200)
        .json({ message: "Deleted Your Coupon " + coupon.name + "." })
    : res.status(200).json({ message: "Not Found This Coupon." });
});

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
