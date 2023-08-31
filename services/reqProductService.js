const expressAsyncHandler = require("express-async-handler");

const reqProductModule = require("./../modules/reqProduct");
const apiError = require("../utils/apiError");







// @desc   Admin can get all Requests products
// @route  GET /api/v1/reqProduct
// @access Private/Admin-Manger
const getReqProducts = expressAsyncHandler(async (req, res, next) => {
  const reqProducts = await reqProductModule.find({})
  res.status(200).json({
    status: "sacces",
    data: reqProducts,
  });
});

// @desc   Admin can delete sapsific Request product
// @route  DELETE /api/v1/reqProduct/:reqProduct
// @access Private/Admin-Manger
const deleteReqProduct = expressAsyncHandler(async (req, res, next) => {
  const { reqProduct } = req.params;
    if (!req.body.titleNeed) {
      throw next(
        new apiError("You must enter the title request or id request", 400)
      );
    }
    const getReqProductVal = await reqProductModule.findByIdAndDelete(reqProduct);

  res.status(204).json({
    status: "sacces",
    data: getReqProductVal,
  });
});

// @desc   Admin can delete sapsific Request product
// @route  DELETE /api/v1/reqProduct/:reqProduct
// @access Private/Admin-Manger
const getReqProduct = expressAsyncHandler(async (req, res, next) => {
  const { reqProduct } = req.params;
  if (!req.body.titleNeed) {
    throw next(
      new apiError("You must enter the title request or id request", 400)
    );
  }
  const getReqProductVal = await reqProductModule.findById(reqProduct);
  if (!getReqProductVal) {
    throw next(
      new apiError("Not Found Request on this id", 404)
    );
  }
  res.status(200).json({
    status: "sacces",
    data: getReqProductVal,
  });
});

// @desc   Insert Requesting products from the user side
// @route  POST /api/v1/reqProduct
// @access Public/UserLogged
const addReqProduct = expressAsyncHandler(async (req, res, next) => {
  if (!req.body.titleNeed) {
    throw next(new apiError("You must enter the request", 400));
  }
  const reqProduct = await reqProductModule.create(req.body);
  res.status(200).json({
    status: "sacces",
    data: reqProduct,
  });
});

module.exports = {
  getReqProducts,
  deleteReqProduct,
  addReqProduct,
  getReqProduct,
};
