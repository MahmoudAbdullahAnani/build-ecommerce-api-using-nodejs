const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const UserModel = require("../modules/userModule");
const { default: slugify } = require("slugify");

const checkIsAuth = expressAsyncHandler(async (token, req, res, next) => {
  // Get token
  // Verfiy this token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    throw next(new apiError("error in token", 498));
  }
  // get user by id (this id in the decoded.userId)
  const user = await UserModel.findById(decoded.userId).populate({
    path: "wishlist",
    select: "title description quantity imageCover",
  });
  return user;
});

//  @desc    Get Data logged User Data
//  @Router  GET api/v1/me
//  @access  Public/me
const getMyData = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = await checkIsAuth(token);
  if (!user) {
    throw next(new apiError("user not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//  @desc    Update Data logged User Data
//  @Router  PUT api/v1/me
//  @access  Public/me
const updataMyDate = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = await checkIsAuth(token);
  if (!user) {
    throw next(new apiError("user not found", 404));
  }
  if (!req.body.name || !req.body.phone || !req.body.email) {
    throw next(new apiError("name, phone and email are required", 400));
  }
  const nameSlug = slugify(req.body.name) || "";
  const updateUser = await UserModel.findByIdAndUpdate(
    user._id,
    {
      name: req.body.name,
      slug: nameSlug,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  ).select("-__v");
  res.status(200).json({
    success: true,
    data: updateUser,
  });
});

//  @desc    Delete(Not enabled) User Account
//  @Router  DELETE api/v1/me
//  @access  Public/me
const deleteMyAccount = expressAsyncHandler(async (req, res, next) => {
  // Get Token (userId)
  const token = req.headers.authorization.split(" ")[1];
  const user = await checkIsAuth(token);
  if (!user) {
    throw next(new apiError("user not found", 404));
  }
  // change User Module activet to false
  if (!user.active) {
    return res.status(200).json({
      success: true,
      message: "this account his be unactive",
    });
  }
  // change User Module activet to false
  await UserModel.findByIdAndUpdate(
    user._id,
    {
      active: false,
    },
    { new: true }
  ).select("-__v");
  res.status(200).json({
    success: true,
    message: "user new is unactive",
  });
});

// //  @desc    Activate (enabled) User Account
// //  @Router  PUT api/v1/me
// //  @access  Public/me
// const activateMyAccount = expressAsyncHandler(async (req, res, next) => {

// })
module.exports = {
  getMyData,
  updataMyDate,
  deleteMyAccount,
};
