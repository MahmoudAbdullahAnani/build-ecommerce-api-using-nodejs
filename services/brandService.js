const expressAsyncHandler = require("express-async-handler");
const brandModule = require("../modules/brandModule");
const apiError = require("../utils/apiError");
const { default: slugify } = require("slugify");

// @desc      Get All Brands
// @Route     GET /api/v1/brands
// @access    Public
const getBrands = expressAsyncHandler(async (req, res, next) => {
  const { page } = req.query || 1;
  const { limit } = req.query || 5;
  const skip = (page - 1) * limit;
  const brand = await brandModule.find({}).skip(skip).limit(limit);
  const data = {
    message: "Success",
    error: null,
    data: brand,
  };
  res.status(200).json(data);
});

// @desc      Get Brand
// @Route     GET /api/v1/brands/:id
// @access    Public
const getBrand = expressAsyncHandler(async (req, res, next) => {
  const brand = await brandModule.findById(req.params.id);
  const data = {
    message: "Success",
    error: null,
    data: brand,
  };
  brand
    ? res.status(200).json(data)
    : next(new apiError("invalid brand id", 404));
});

// @desc      Create Brand
// @Route     POST /api/v1/brands
// @access    Private
const createBrand = expressAsyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const brand = await brandModule.create({ name, slug: slugify(name) });
  const data = {
    message: "Success",
    error: null,
    data: brand,
  };
  res.status(201).json(data);
});

// @desc      Update Brand
// @Route     PUT /api/v1/brands/:id
// @access    Private
const updateBrand = expressAsyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const brand = await brandModule.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );
  const data = {
    message: "Success",
    error: null,
    data: brand,
  };
  res.status(200).json(data);
});

// @desc      Delte Brand
// @Route     DELETE /api/v1/brands/:id
// @access    Private
const deleteBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModule.findByIdAndDelete(id);
  const data = {
    message: "Success",
    error: null,
    data_deleted: brand,
  };
  res.status(200).json(data);
});

module.exports = {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
