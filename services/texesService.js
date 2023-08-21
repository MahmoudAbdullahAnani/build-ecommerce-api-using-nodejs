const expressAsyncHandler = require("express-async-handler");
const texesModule = require("../modules/texesModule");

// @docs    Create Texes
// @Router  POST /api/v1/texes
// @access  Private/Admin-Manger
const createOrUpdateTexes = expressAsyncHandler(async (req, res, next) => {
  const isTexes = await texesModule.findOne({});
  if (isTexes) {
    isTexes.texPrice = req.body.texPrice;
    isTexes.shippingPrice = req.body.shippingPrice;
  } else {
    const texes = await texesModule.create({
      texPrice: req.body.texPrice,
      shippingPrice: req.body.shippingPrice,
    });
    return res.status(201).json({
      message: "created texes price and shipping price",
      data: texes,
    });
  }
  await isTexes.save();
  res.status(200).json({
    message: "updates texes price and shipping price",
    data: isTexes,
  });
});

// @docs    Get All Texes
// @Router  GET /api/v1/texes
// @access  Private/Admin-Manger
const getTexes = expressAsyncHandler(async (req, res, next) => {
  const texes = await texesModule.findOne({});
  res.status(200).json({ message: "All Texes", data: texes });
});

module.exports = {
  createOrUpdateTexes,
  getTexes,
};
